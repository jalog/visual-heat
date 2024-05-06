'use strict';
importScripts('/visual-heat/assets/Utils.js');

onmessage = function(e) {
  let tdata = [];
  const t = e.data[0];
  const Mx = e.data[1], Ny = e.data[2];
  const
    Lx = e.data[3],
    Ly = e.data[4],
    Drxs = e.data[5],
    Midu = e.data[6],
    Bire = e.data[7],
    Neiry = e.data[8],
    Dt = e.data[9],
    Tmax = e.data[10],
    Tmin = e.data[11],
    h1 = e.data[12],
    h2 = e.data[13],
    h3 = e.data[14],
    h4 = e.data[15],
    tf1 = e.data[16],
    tf2 = e.data[17],
    tf3 = e.data[18],
    tf4 = e.data[19];
  const step = e.data[20];
  const Precision = e.data[21];

  const
    dx = Lx / (Mx - 1),
    dy = Ly / (Ny - 1);
  const rksl = Drxs / (Midu * Bire);
  const 
    Fox = rksl * Dt / (dx * dx),
    Foy = rksl * Dt / (dy * dy);
  const
    Bi1 = h1 * dx/Drxs,
    Bi2 = h2 * dx/Drxs,
    Bi3 = h3 * dy/Drxs,
    Bi4 = h4 * dy/Drxs;
  const Gong = Dt * Neiry / Midu / Bire;

  const
    fz11 = Gong + 2*Fox*Bi1*tf1 + 2*Foy*Bi4*tf4,
    fzj1 = Gong + 2*Foy*Bi4*tf4,
    fzMx1 = Gong + 2*Fox*Bi2*tf2 + 2*Foy*Bi4*tf4,
    fz1i = Gong + 2*Fox*Bi1*tf1,
    fzji = Gong,
    fzMxi = Gong + 2*Fox*Bi2*tf2,
    fz1Ny = Gong + 2*Fox*Bi1*tf1 + 2*Foy*Bi3*tf3,
    fzjNy = Gong + 2*Foy*Bi3*tf3,
    fzMxNy = Gong + 2*Fox*Bi2*tf2 + 2*Foy*Bi3*tf3;
  const
    fm11 = 1 + 2*Fox + 2*Foy + 2*Fox*Bi1 + 2*Foy*Bi4,
    fmj1 = 1 + 2*Fox + 2*Foy + 2*Foy*Bi4,
    fmMx1 = 1 + 2*Fox + 2*Foy + 2*Fox*Bi2 + 2*Foy*Bi4,
    fm1i = 1 + 2*Fox + 2*Foy + 2*Fox*Bi1,
    fmji = 1 + 2*Fox + 2*Foy,
    fmMxi = 1 + 2*Fox + 2*Foy + 2*Fox*Bi2,
    fm1Ny = 1 + 2*Fox + 2*Foy + 2*Fox*Bi1 + 2*Foy*Bi3,
    fmjNy = 1 + 2*Fox + 2*Foy + 2*Foy*Bi3,
    fmMxNy = 1 + 2*Fox + 2*Foy + 2*Fox*Bi2 + 2*Foy*Bi3;

  let ti;
  for(let stepi = 1; stepi <= step; stepi++) {
    ti = deepclone(t);
    let tt;
    for (var k = 0; k < Precision[1]; k++) {
      tt = deepclone(t);
      t[0][0] = (ti[0][0] + 2 * Fox * t[1][0] + 2 * Foy * t[0][1] + fz11) / fm11;
      for (var j = 1; j < Mx - 1; j++) {
        t[j][0] = (ti[j][0] + Fox * t[j - 1][0] + Fox * t[j + 1][0] + 2 * Foy * t[j][1] + fzj1) / fmj1;
      }
      t[Mx - 1][0] = (ti[Mx - 1][0] + 2 * Fox * t[Mx - 2][0] + 2 * Foy * t[Mx - 1][1] + fzMx1) / fmMx1;
      for (var i = 1; i < Ny - 1; i++) {
        t[0][i] = (ti[0][i] + 2 * Fox * t[1][i] + Foy * t[0][i - 1] + Foy * t[0][i + 1] + fz1i) / fm1i;
        for (var j = 1; j < Mx - 1; j++) {
          t[j][i] = (ti[j][i] + Fox * t[j - 1][i] + Fox * t[j + 1][i] + Foy * t[j][i - 1] + Foy * t[j][i + 1] + fzji) / fmji;
        }
        t[Mx - 1][i] = (ti[Mx - 1][i] + 2 * Fox * t[Mx - 2][i] + Foy * t[Mx - 1][i - 1] + Foy * t[Mx - 1][i + 1] + fzMxi) / fmMxi;
      }
      t[0][Ny - 1] = (ti[0][Ny - 1] + 2 * Foy * t[0][Ny - 2] + 2 * Fox * t[1][Ny - 1] + fz1Ny) / fm1Ny;
      for (var j = 1; j < Mx - 1; j++) {
        t[j][Ny - 1] = (ti[j][Ny - 1] + Fox * t[j - 1][Ny - 1] + Fox * t[j + 1][Ny - 1] + 2 * Foy * t[j][Ny - 2] + fzjNy) / fmjNy;
      }
      t[Mx - 1][Ny - 1] = (ti[Mx - 1][Ny - 1] + 2 * Fox * t[Mx - 2][Ny - 1] + 2 * Foy * t[Mx - 1][Ny - 2] + fzMxNy) / fmMxNy;
      if (maxABS2w(tt, t) < Precision[0]) break;
    }
    tdata.push(deepclone(t));
  }
  postMessage([tdata, Tmax, Tmin, Lx, Ly, h1, h2, h3, h4, tf1, tf2, tf3, tf4, Dt, step]);
};
