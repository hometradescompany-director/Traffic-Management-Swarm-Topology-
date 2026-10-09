const requiredText = (value, field) => {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${field} must be a non-empty string`);
};

/** Validate a transported contract independently; no shared mutable Maps state. */
export function ingestTrafficObservations(batch) {
  if (batch?.contract !== 'traffic-observations.v1') throw new TypeError('unsupported contract');
  if (batch.producer !== 'hometradescompany-director/SEQ-Maps') throw new TypeError('unsupported producer');
  if (!Array.isArray(batch.observations)) throw new TypeError('observations must be an array');
  const seen = new Set();
  const observations = batch.observations.map(input => {
    if (!input || typeof input !== 'object') throw new TypeError('observation must be an object');
    for (const field of ['id', 'kind', 'sourceRef', 'subjectRef']) requiredText(input[field], field);
    for (const field of ['validAt', 'knownAt', 'ingestedAt']) {
      requiredText(input[field], field);
      if (Number.isNaN(Date.parse(input[field]))) throw new TypeError(`invalid ${field}`);
    }
    if (!['declared', 'missing', 'unknown'].includes(input.license?.standing)) throw new TypeError('invalid license.standing');
    if (input.license.standing === 'declared') requiredText(input.license.id, 'license.id');
    if (input.evidenceRef !== null && input.evidenceRef !== undefined) requiredText(input.evidenceRef, 'evidenceRef');
    if (seen.has(input.id)) throw new TypeError(`duplicate observation id: ${input.id}`);
    seen.add(input.id);
    return { observationRef: input.id, sourceRef: input.sourceRef, subjectRef: input.subjectRef,
      validAt: input.validAt, knownAt: input.knownAt, ingestedAt: input.ingestedAt,
      license: structuredClone(input.license), evidenceRef: input.evidenceRef ?? null,
      mapping: { state: 'unknown', reason: 'No validated graph-edge mapping supplied' } };
  });
  return { contract: 'traffic-ingest-receipt.v1', producer: 'hometradescompany-director/Traffic-Management-Swarm-Topology-', routingReady: false, observations };
}
