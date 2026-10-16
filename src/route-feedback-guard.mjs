/** Estimate the load added by a proposed route recommendation without claiming measured congestion. */
export function assessRouteLoad({baselineVehicles, recommendedVehicles, capacityVehicles, maxUtilization=0.9}) {
  const numbers=[baselineVehicles,recommendedVehicles,capacityVehicles,maxUtilization];
  if(numbers.some(n=>typeof n!=='number'||!Number.isFinite(n))||baselineVehicles<0||recommendedVehicles<0||capacityVehicles<=0||maxUtilization<=0||maxUtilization>1)
    return {allowed:false,reason:'invalid_inputs'};
  const projectedUtilization=(baselineVehicles+recommendedVehicles)/capacityVehicles;
  if(projectedUtilization>maxUtilization) return {allowed:false,reason:'projected_overload',projectedUtilization};
  return {allowed:true,reason:'within_limit',projectedUtilization};
}
