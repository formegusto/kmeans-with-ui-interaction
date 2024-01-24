import Errors from "@errors";
import {
  euclideanDistance,
  generateRandomDataset,
  linearInterpolation,
} from "@utils";

const INTERPOLATION_RATE = 10;

export class KMeans implements IKMeans {
  constructor(public K: number, public dataset?: IPoint[]) {}

  [Symbol.iterator](): Iterator<IKMeansResult> {
    return new KMeansIterator(
      this.K,
      this.dataset ?? generateRandomDataset({ shape: [100, 2] })
    );
  }

  fit({ dataset }: IKMeansMethodParams) {
    if (!dataset) throw Errors.EmptyRequiredParameters("dataset");
    const iterator = new KMeansIterator(this.K, dataset);
    let result;
    for (result of iterator);
    return result;
  }

  steps({ dataset }: IKMeansMethodParams): IKMeansResult[] {
    if (!dataset) throw Errors.EmptyRequiredParameters("dataset");
    const iterator = new KMeansIterator(this.K, dataset);
    return [...iterator];
  }
}

export class KMeansIterator implements IKMeansIterator {
  centers?: IPoint[] | undefined;

  constructor(public K: number, public dataset: IPoint[]) {
    this.centers = this.initCenters({ dataset });
  }

  initCenters({ dataset }: IKMeansMethodParams): IPoint[] {
    if (!dataset) throw Errors.EmptyRequiredParameters("dataset");

    // 1. 첫 번째 중심점을 무작위로 설정
    const centers = [this.dataset[Math.floor(Math.random() * dataset.length)]];

    // 4. 2~3의 과정을 설정된 K 변수 만큼의 중심점이 설정될 때 까지 반복
    while (centers.length < this.K) {
      // 2. 설정된 중심점과 데이터 간의 거리 계산
      const distances = this.calcDistances({ dataset, centers });

      // 3. 거리의 총합이 최대인 데이터 포인트를 다음 중심으로 설정
      const totalDistances = distances.map((distance) =>
        distance.reduce((acc, cur) => acc + cur, 0)
      );
      const nextCenterIdx = totalDistances.getMaxIdx();
      centers.push(this.dataset[nextCenterIdx]);
    }

    return centers as IPoint[];
  }

  calcDistances({ dataset, centers }: IKMeansMethodParams): number[][] {
    if (!dataset || !centers)
      throw Errors.EmptyRequiredParameters("dataset", "centers");

    const distances = [];
    for (let data of dataset) {
      const distance = centers.map((center) => euclideanDistance(center, data));
      distances.push(distance);
    }

    return distances;
  }

  setLabels({ distances }: IKMeansMethodParams): number[] {
    if (!distances) throw Errors.EmptyRequiredParameters("distances");
    return distances.map((distance) => distance.getMinIdx());
  }

  moveCenters({
    dataset,
    centers,
    labels,
    // ui interpolation
    distances,
  }: IKMeansMethodParams): {
    nextCenters: IPoint[];
    labelInterpolations: any;
  } | null {
    if (!dataset || !centers || !labels || !distances)
      throw Errors.EmptyRequiredParameters("dataset", "centers", "labels");

    const colSize = dataset[0].length;
    // const labelCount = Array(this.K).fill(0);
    // const labelCount = Array(this.K).fill([]); call-by-references
    const labelCount = Array.from({ length: this.K }, () => new Array(0));
    const labelDistances = Array.from({ length: this.K }, () => new Array(0));
    const labelTotal = Array.from({ length: this.K }, () =>
      Array(colSize).fill(0)
    );

    for (let i = 0; i < dataset.length; i++) {
      const label = labels[i];
      const data = dataset[i];
      const distance = distances[i];
      labelCount[label].push(i);
      // console.log("in", labelCount[label], Date.now());
      labelDistances[label].push(distance[distance.getMinIdx()]);
      labelTotal[label] = labelTotal[label].map((v, vi) => v + data[vi]);
    }

    const nextCenters = labelCount.map((count, label) =>
      labelTotal[label].map((total) => total / count.length)
    );

    const prev = centers.flat();
    const next = nextCenters.flat();
    for (let i = 0; i < prev.length; i++) {
      if (prev[i] !== next[i]) {
        const labelInterpolations = [];
        // label sorting
        for (let j = 0; j < this.K; j++) {
          const labelInterpolation = [];
          labelCount[j].sort((a, b) => {
            const a_i = labelCount[j].indexOf(a);
            const b_i = labelCount[j].indexOf(b);
            return labelDistances[j][a_i] - labelDistances[j][b_i];
          });

          const count = labelCount[j].length;
          const stepCount = Math.floor(count / INTERPOLATION_RATE);
          let startIdx = 0;
          for (let c = 0; c < INTERPOLATION_RATE; c++) {
            let _labelInterpolation;
            if (c + 1 === INTERPOLATION_RATE) {
              _labelInterpolation = labelCount[j].slice(startIdx);
            } else {
              _labelInterpolation = labelCount[j].slice(
                startIdx,
                startIdx + stepCount
              );
            }
            labelInterpolation.push(_labelInterpolation);
            startIdx += stepCount;
          }

          labelInterpolations.push(labelInterpolation);
        }

        return { nextCenters: nextCenters as IPoint[], labelInterpolations };
      }
    }
    return null;
  }

  calcInertia({ dataset, centers, labels }: IKMeansMethodParams): number {
    if (!dataset || !centers || !labels)
      throw Errors.EmptyRequiredParameters("dataset", "centers", "labels");

    let inertia = 0;

    for (let i = 0; i < dataset.length; i++) {
      const a = dataset[i];
      const b = centers[labels[i]];
      const sse = a.reduce((acc, cur, j) => acc + (cur - b[j]) ** 2, 0);
      inertia += sse;
    }

    return inertia;
  }

  next(): IteratorResult<IKMeansResult> {
    if (!this.centers) return { value: undefined, done: true };
    // 2. 중심점과 데이터 간의 거리 계산
    const distances = this.calcDistances({ ...this });
    // 3. 최소 거리 중심점의 군집 번호를 데이터에 부여
    const labels = this.setLabels({ distances });
    // *. 평가
    const inertia = this.calcInertia({ ...this, labels });
    // 4. 군집 별 평균값을 계산하여 중심점에 반영
    const moveCentersResult = this.moveCenters({ ...this, labels, distances });

    const result: IteratorResult<IKMeansResult> = {
      value: {
        centers: this.centers,
        labels,
        inertia,
      },
      done: false,
    };
    // 5. 2~4의 과정을 중심점에 변화가 없을 때까지 반복
    if (!moveCentersResult) {
      this.centers = undefined;
      result.value.dataset = this.dataset;
      return result;
    }
    // ui-sub. interpolation
    const interpolations: IPoint[][] = [];
    for (let i = 0; i < this.K; i++) {
      const _interpolations: IPoint[] = [];
      for (let t = 0.1; t <= 1; t += 0.1) {
        const interpolation = linearInterpolation(
          this.centers[i],
          moveCentersResult.nextCenters![i],
          t
        );
        _interpolations.push(interpolation);
      }
      interpolations.push(_interpolations);
    }
    // console.log(interpolations);
    this.centers = moveCentersResult.nextCenters as IPoint[];

    result.value.interpolations = interpolations;
    result.value.labelInterpolations = moveCentersResult.labelInterpolations;

    return result;
  }

  [Symbol.iterator](): IterableIterator<IKMeansResult> {
    return this;
  }
}
