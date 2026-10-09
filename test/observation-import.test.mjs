import test from 'node:test';
import assert from 'node:assert/strict';
import { ingestTrafficObservations } from '../src/connectors/observation-import.mjs';

const batch = { contract: 'traffic-observations.v1', producer: 'hometradescompany-director/SEQ-Maps', observations: [{ id: 'event:1', sourceRef: 'source:1', subjectRef: 'road-event:1', kind: 'transport.incident.observed', validAt: '2026-10-09T01:00:00Z', knownAt: '2026-10-09T01:05:00Z', ingestedAt: '2026-10-09T01:06:00Z', license: { standing: 'declared', id: 'CC-BY-4.0' }, evidenceRef: null, payload: { status: 'active' } }] };
test('accepts a batch without claiming graph mapping or route readiness', () => {
  const original = structuredClone(batch);
  const receipt = ingestTrafficObservations(batch);
  assert.equal(receipt.contract, 'traffic-ingest-receipt.v1');
  assert.equal(receipt.observations[0].mapping.state, 'unknown');
  assert.equal(receipt.observations[0].observationRef, 'event:1');
  assert.equal(receipt.routingReady, false);
  assert.deepEqual(batch, original);
  assert.equal(receipt.observations[0].payload, undefined);
});
test('rejects unsupported versions and incomplete provenance', () => {
  assert.throws(() => ingestTrafficObservations({ ...batch, contract: 'traffic-observations.v2' }), /contract/);
  const broken = structuredClone(batch); delete broken.observations[0].sourceRef;
  assert.throws(() => ingestTrafficObservations(broken), /sourceRef/);
});
test('rejects duplicate observation identities and missing licence standing', () => {
  assert.throws(() => ingestTrafficObservations({ ...batch, observations: [...batch.observations, ...batch.observations] }), /duplicate/);
  const broken = structuredClone(batch); broken.observations[0].license = {};
  assert.throws(() => ingestTrafficObservations(broken), /license/);
});
