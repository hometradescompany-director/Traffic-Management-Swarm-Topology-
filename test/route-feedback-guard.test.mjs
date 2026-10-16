import test from 'node:test';import assert from 'node:assert/strict';import {assessRouteLoad as assess} from '../src/route-feedback-guard.mjs';
test('allows bounded projected load',()=>assert.equal(assess({baselineVehicles:40,recommendedVehicles:10,capacityVehicles:100}).allowed,true));
test('rejects recommendations that overload',()=>assert.equal(assess({baselineVehicles:85,recommendedVehicles:10,capacityVehicles:100}).reason,'projected_overload'));
test('rejects invalid capacity and NaN',()=>{assert.equal(assess({baselineVehicles:0,recommendedVehicles:1,capacityVehicles:0}).allowed,false);assert.equal(assess({baselineVehicles:NaN,recommendedVehicles:1,capacityVehicles:10}).allowed,false)});
