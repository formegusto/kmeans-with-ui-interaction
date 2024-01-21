const Errors = {
  NotSettingInitCentroids: new Error("초기 중심점이 설정되지 않았습니다."),
  EmptyRequiredParameters: (...params: string[]) =>
    new Error(`필수 매개 변수(${params.join(", ")})가 제공되지 않았습니다.`),
};

export default Errors;
