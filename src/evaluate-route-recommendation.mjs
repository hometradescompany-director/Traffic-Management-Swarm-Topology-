import { assessRouteLoad } from "./route-feedback-guard.mjs";
/** A bounded evaluation entry point: recommendations are never automatically dispatched. */
export function evaluateRouteRecommendation(proposal) {
  if (!proposal || typeof proposal !== "object" || typeof proposal.routeRef !== "string" || !proposal.routeRef.trim())
    return {accepted:false,reason:"missing_route_reference"};
  const load = assessRouteLoad(proposal);
  return {accepted:load.allowed,reason:load.reason,routeRef:proposal.routeRef,...(load.projectedUtilization===undefined?{}:{projectedUtilization:load.projectedUtilization})};
}
