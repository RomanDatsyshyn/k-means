// -10,5,-10,3,-10,4,4,2,5,4,6,5,6,1,4,-3,5,-3,6,-3,5,-4,7,-2
let points = [];
let html = "";

let Zn = [];
let distances;
let clusters;

let extraArrayX = new Array();
let extraArrayY = new Array();

const start = () => {
  let coordinates = document.getElementById("points").value;
  var p = coordinates.split(",").map(Number);

  for (let i = 0; i < p.length - 1; i += 2) {
    points.push([p[i], p[i + 1]]);
  }

  console.log(points);

  step1();
};

const step1 = () => {
  Zn.push(points[0]);
  Zn.push(points[5]);
  Zn.push(points[10]);
  html += `<b>1.</b> Координати початкових центрів: <br>`;
  for (let i = 0; i < Zn.length; i++) {
    html += `<b>Z${i + 1}</b> (${Zn[i][0]}:${Zn[i][1]}) <br>`;
  }
  step2();
};

const getDistances = () => {
  distances = [];

  for (let i = 0; i < Zn.length; i++) {
    distances.push([]);
  }

  for (let i = 0; i < Zn.length; i++) {
    let dis = [];
    for (let j = 0; j < points.length; j++) {
      dis.push(
        Math.sqrt(
          Math.pow(Zn[i][0] - points[j][0], 2) +
            Math.pow(Zn[i][1] - points[j][1], 2)
        )
      );
    }
    distances[i] = dis;
  }
};

const minValue = items => {
  let minNumber = items[0];
  for (let i = 0; i < items.length; i++) {
    if (minNumber > items[i]) minNumber = items[i];
  }
  let id = items.indexOf(minNumber);
  return id;
};

const clusterization = () => {
  clusters = [];

  for (let i = 0; i < Zn.length; i++) {
    clusters.push([]);
  }

  for (let i = 0; i < points.length; i++) {
    let d = [];
    for (let j = 0; j < Zn.length; j++) {
      d.push(distances[j][i]);
    }
    clusters[minValue(d)].push(points[i]);
  }

  let arr = [];
  for (let i = 0; i < clusters.length; i++) {
    if (clusters[i].length > 0) {
      arr.push(clusters[i]);
    }
  }
  clusters = arr;
};

const newCenters = () => {
  let newZn = [];

  for (let i = 0; i < clusters.length; i++) {
    let sumX = 0;
    let sumY = 0;

    for (let j = 0; j < clusters[i].length; j++) {
      sumX += clusters[i][j][0];
      sumY += clusters[i][j][1];
    }

    let x = sumX / clusters[i].length;
    let y = sumY / clusters[i].length;

    newZn.push([x, y]);
  }
  html += `<b>3.</b> Координати нових центрів: <br>`;
  for (let i = 0; i < newZn.length; i++) {
    html += `<b>Z${i + 1}</b> (${newZn[i][0]}:${newZn[i][1]}) <br>`;
  }
  return newZn;
};

const step2 = () => {
  getDistances();
  clusterization();
  html += `<b>2.</b> Розподіл точок по кластерам: <br>`;
  for (let i = 0; i < clusters.length; i++) {
    html += `Кластер <b>S${i + 1}</b>: <br>`;
    for (let j = 0; j < clusters[i].length; j++) {
      html += `(${clusters[i][j][0]}:${clusters[i][j][1]}) `;
    }
    html += `<br>`;
  }
  step3();
};

const step3 = () => {
  step4(newCenters());
  html += `<b>4.</b> Умова Zi = Zj, i=1,...,k виконується <br>`;
};

/////// Візуалізація роботи алгоритму ///////
const getData = () => {
  for (let i = 0; i < clusters.length; i++) {
    let xArr = new Array();
    for (let j = 0; j < clusters[i].length; j++) {
      xArr[j] = clusters[i][j][0];
    }
    extraArrayX[i] = xArr;
  }

  for (let i = 0; i < clusters.length; i++) {
    let yArr = new Array();
    for (let j = 0; j < clusters[i].length; j++) {
      yArr[j] = clusters[i][j][1];
    }
    extraArrayY[i] = yArr;
  }

  visualization();
};

const visualization = () => {
  var data = [];

  for (let i = 0; i < clusters.length; i++) {
    let name = `S${i + 1}`;
    data.push({
      x: extraArrayX[i],
      y: extraArrayY[i],
      mode: "markers",
      type: "scatter",
      name: name,
      marker: { size: 12 }
    });
  }

  for (let i = 0; i < Zn.length; i++) {
    let name = `Z${i + 1}`;
    data.push({
      x: [Zn[i][0]],
      y: [Zn[i][1]],
      mode: "markers",
      type: "scatter",
      name: name,
      marker: { size: 13, color: ["#2a3d3a"] }
    });
  }

  data.push({
    x: [13],
    y: [13],
    mode: "markers",
    type: "scatter",
    name: name,
    marker: { size: 12, color: ["#ffffff"] }
  });

  data.push({
    x: [-13],
    y: [-13],
    mode: "markers",
    type: "scatter",
    name: name,
    marker: { size: 12, color: ["#ffffff"] }
  });

  Plotly.newPlot("container", data, { showSendToCloud: false });
};
//////////////////////////////////////////////////

const step4 = newZn => {
  for (let i = 0; i < Zn.length; i++) {
    if (newZn[i][0] !== Zn[i][0] || newZn[i][1] !== Zn[i][1]) {
      html += `<b>4.</b> Умова Zi = Zj, i=1,...,k не виконується <br>`;
      Zn = [...newZn];
      step2();
      break;
    }
  }
  getData();
  document.getElementById("math").innerHTML = html;
};
