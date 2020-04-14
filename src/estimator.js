const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  let days = data.timeToElapse;
  if (data.periodType === 'weeks') days *= 7;
  else if (data.periodType === 'months') days *= 30;

  const factor = Math.trunc(days / 3);

  impact.currentlyInfected = data.reportedCases * 10;
  severeImpact.currentlyInfected = data.reportedCases * 50;

  const currentInfections = (obj) => {
    obj.infectionsByRequestedTime = obj.currentlyInfected * (2 ** factor);
    return false;
  };
  currentInfections(impact);
  currentInfections(severeImpact);

  const infectionsByTime = (obj) => {
    obj.severeCasesByRequestedTime = Math.trunc(0.15 * obj.infectionsByRequestedTime);
  };
  infectionsByTime(impact);
  infectionsByTime(severeImpact);

  const bedAvailability = (obj) => {
    obj.hospitalBedsByRequestedTime = Math.trunc((0.35 * data.totalHospitalBeds)
      - obj.severeCasesByRequestedTime);
  };
  bedAvailability(impact);
  bedAvailability(severeImpact);

  const icuCasesByTime = (obj) => {
    obj.casesForICUByRequestedTime = Math.trunc(0.05 * obj.infectionsByRequestedTime);
  };
  icuCasesByTime(impact);
  icuCasesByTime(severeImpact);

  const ventilatorCasesByTime = (obj) => {
    obj.casesForVentilatorsByRequestedTime = Math.trunc(0.02 * obj.infectionsByRequestedTime);
  };
  ventilatorCasesByTime(impact);
  ventilatorCasesByTime(severeImpact);

  const avgDailyIncome = (obj) => {
    obj.dollarsInFlight = Math.trunc((obj.infectionsByRequestedTime
      * data.region.avgDailyIncomePopulation
      * data.region.avgDailyIncomeInUSD) / days);
  };
  avgDailyIncome(impact);
  avgDailyIncome(severeImpact);
  return {
    data,
    impact,
    severeImpact
  };
};
export default covid19ImpactEstimator;
