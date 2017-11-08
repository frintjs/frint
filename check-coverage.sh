LINES_COVERAGE_PERCENTAGE=`./node_modules/.bin/istanbul-combine -d coverage -p summary -r lcov -r html packages/frint*/coverage/coverage*.json | grep Lines | awk '{print $3}' | tr -d '[:space:]' | tr -d '%'`;
EXPECTED_LINES_COVERAGE_PERCENTAGE=$1;
EXPECTED_LINES_COVERAGE_PERCENTAGE=${EXPECTED_LINES_COVERAGE_PERCENTAGE:=98};

COMPARISON_RESULT=`echo "${LINES_COVERAGE_PERCENTAGE} < ${EXPECTED_LINES_COVERAGE_PERCENTAGE}" | bc -l`

if [[ $COMPARISON_RESULT -eq 1 ]]; then
  echo "Current lines coverage (${LINES_COVERAGE_PERCENTAGE}) is lower than the minimum expected (${EXPECTED_LINES_COVERAGE_PERCENTAGE}%)";
  exit 1;
fi
