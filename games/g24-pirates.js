// Game 24 — Pirate Parcel Mix-Up (chain reaction)
// Pirate students fire foam balls into an island machine; balls roll over barrels, a wooden bridge, a bell and a wheel
// and open one of ten parcels.
// Twist: the first chain opens a parcel with a fake spring; the parrot spins the spare wheel, swings the bridge and fires the real winning chain.
(() => {
  const CANNON = [180, 260], BELL = [700, 230], WHEEL = [930, 420];
  const PATH = [[230, 240], [380, 300], [520, 330], [650, 260], [700, 250], [800, 360], [930, 420], [1060, 440]];   // barrels → bridge → bell → wheel
  const PARCELS = [...Array(10).keys()].map(i => [1180 + (i % 2) * 150, 160 + Math.floor(i / 2) * 140]);
  const PIRATES = [...Array(10).keys()].map(i => [130 + i * 120, 850]);
  const BOXES = ['p5', 'p6', 'p7', 'p10', 'p11'];

  function along(pts, k) {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    let d = clamp(k) * L;
    for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const u = d / seg[i]; return [lerp(pts[i][0], pts[i + 1][0], u), lerp(pts[i][1], pts[i + 1][1], u)]; } d -= seg[i]; }
    return pts[pts.length - 1];
  }
  const toParcel = c => [...PATH, [PARCELS[c][0] - 40, PARCELS[c][1] + 10], PARCELS[c]];
  function spring(x, y, k, t) {
    const h = 80 * k * (1 + .15 * Math.sin(t * 25));
    ctx.save(); ctx.strokeStyle = '#c9c9d9'; ctx.lineWidth = 5; ctx.beginPath();
    for (let i = 0; i <= 24; i++) { const u = i / 24; ctx.lineTo(x + Math.sin(u * Math.PI * 10) * 12, y - u * h); } ctx.stroke();
    ctx.fillStyle = '#ffd84a'; ctx.beginPath(); ctx.arc(x, y - h - 10, 12, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function machine(t, swing) {
    // barrels, bridge and bell drawn in code on top of the base
    [[330, 330], [470, 360]].forEach(([x, y]) => { ctx.save(); ctx.fillStyle = '#a0703f'; roundRect(ctx, x - 30, y - 10, 60, 70, 12); ctx.fill(); ctx.fillStyle = '#7a4a24'; ctx.fillRect(x - 30, y + 8, 60, 6); ctx.fillRect(x - 30, y + 38, 60, 6); ctx.restore(); });
    ctx.save(); ctx.translate(580, 300); ctx.rotate(swing); ctx.fillStyle = '#c99561'; ctx.fillRect(-10, -6, 140, 14); for (let i = 0; i < 7; i++) { ctx.fillStyle = '#a0703f'; ctx.fillRect(i * 20 - 6, -6, 4, 14); } ctx.restore();
    ctx.save(); ctx.translate(...BELL); ctx.rotate(Math.sin(t * 6) * .1); ctx.fillStyle = '#e8b32a'; ctx.beginPath(); ctx.moveTo(-22, 26); ctx.quadraticCurveTo(-22, -20, 0, -24); ctx.quadraticCurveTo(22, -20, 22, 26); ctx.closePath(); ctx.fill(); ctx.restore();
  }

  GAME_IMPL.g24 = {
    id: 'g24', title: 'Pirate Parcel Mix-Up', base: 'assets/g24/', titleY: 640, paintedOk: false,
    assets: gAssets(['aim', 'fire', 'follow', 'chain', 'false', 'parrot', 'win'], [...BOXES, 'p8', 'p12', 'p13', 'p14', 'p19', 'p21', 'p33', 'parrot0', 'parrot1', 'parrot2', 'wheelset0']),
    startBanner: '🏴‍☠️ Load the foam cannon!', mote: '#fff2d0', rayColor: '#fff2a8',

    setup(r) {
      const parcels = shuffle([...Array(10).keys()]);
      r.players.forEach((p, i) => { p.parcel = parcels[i]; [p.kx, p.ky] = PIRATES[i]; p.x = p.kx; p.y = p.ky - 80; });
      r.fakes = makeFakes(r, 1.6);
      r.runs = r.fakes.map(f => ({ to: f.p.parcel, p: f.p, at: f.at - 1.4, dur: 1.7 }));
      r.goldAt = r.TW - 2;
    },

    tick(r, t, te) {
      const D = r.decoy, Wn = r.winner;
      for (const run of r.runs) {
        if (t > run.at) cue('f' + run.at, () => { SFX.noise(.3, { vol: .2, f: 300, to: 100 }); FX.smoke(...CANNON, 6, '#ffffff'); });
        if (t > run.at + run.dur * .55) cue('bell' + run.at, () => SFX.tone(1320, .3, { vol: .08 }));
        if (t > run.at + run.dur) cue('in' + run.at, () => { SFX.boing(); r.banner = '📦 ' + run.p.name + "'s parcel wobbles… but stays shut!"; });
      }
      if (t > r.goldAt) cue('gold', () => { SFX.noise(.4, { vol: .3, f: 250, to: 90 }); CAM.shake(r, 6); r.banner = '💥 BOOM! The big foam ball is away!'; });
      if (!r.plain) {
        if (te > 0) cue('a', () => { Music.play('tension'); outcome('almost_selected', D); r.banner = '📦 It opens ' + D.name + "'s parcel…"; });
        if (te > .5) cue('b', () => { outcome('wrong_turn', D); SFX.boing(); SFX.sadTrombone(); r.banner = '🌀 A FAKE spring pops out!'; });
        if (te > 1) cue('c', () => { SFX.tone(800, .2, { type: 'square', vol: .06 }); SFX.tone(900, .2, { type: 'square', vol: .06, delay: .2 }); r.banner = '🦜 The parrot spins the spare wheel!'; });
        if (te > 1.5) cue('d', () => { outcome('selected', Wn); SFX.swoosh(); r.banner = '🌉 The bridge swings — the real chain rolls!'; });
      } else {
        if (te > 0) cue('a', () => { Music.play('tension'); outcome('almost_selected', D || Wn); r.banner = '📦 Heading for ' + (D || Wn).name + "'s parcel…"; });
        if (te > 1) cue('b', () => { outcome('selected', Wn); SFX.boing(); r.banner = '⚙️ The wheel turns it another way!'; });
      }
      if (te > 2.9) cue('open', () => { SFX.ding(); SFX.sparkle(); FX.sparkle(...PARCELS[Wn.parcel], 30); });
    },

    ball(r, t) {
      const te = t - r.TW, D = r.decoy || r.winner, Wn = r.winner;
      if (t < r.goldAt) return null;
      if (te < 0) return along(PATH, (t - r.goldAt) / (r.TW - r.goldAt));
      const end = PATH[PATH.length - 1];
      if (!r.plain) {
        if (te < .5) return along([end, PARCELS[D.parcel]], te / .5);
        if (te < 1.5) return null;
        return along([[580, 300], ...PATH.slice(4), [PARCELS[Wn.parcel][0] - 40, PARCELS[Wn.parcel][1] + 10], PARCELS[Wn.parcel]], ease(clamp((te - 1.5) / 1.4)));
      }
      if (te < 1) return along([end, [1100, lerp(end[1], PARCELS[D.parcel][1], .5)]], te);
      return along([[1100, lerp(end[1], PARCELS[D.parcel][1], .5)], PARCELS[Wn.parcel]], ease(clamp((te - 1) / 1.9)));
    },

    render(r, t) {
      const rt = r.now, te = rt - r.TW, done = r.phase === 'done', D = r.decoy, Wn = r.winner;
      machine(rt, !r.plain && te > 1 && te < 2 ? Math.sin((te - 1) * Math.PI) * -.4 : 0);
      drawImg('wheelset0', WHEEL[0], WHEEL[1], 90, { rot: !r.plain && te > 1 ? (te - 1) * 6 : rt * .5 });
      drawImg(te > 0 && rt - r.goldAt < .4 ? 'p8' : 'p12', CANNON[0], CANNON[1], 150);
      for (const p of r.players) {
        const [x, y] = PARCELS[p.parcel], open = (p === Wn && te > 2.9) || done, fake = !r.plain && p === D && te > .5;
        if (open) { FX.halo(x, y, 70, '#ffd84a', .6); drawImg('p14', x, y + 30, 100, { anchor: 'bottom' }); }
        else drawImg(BOXES[p.parcel % 5], x, y + 30, 80, { anchor: 'bottom', rot: (r.runs.some(run => run.p === p && rt > run.at + run.dur && rt < run.at + run.dur + .5) ? Math.sin(rt * 30) * .1 : 0) });
        if (fake && !done) spring(x, y - 20, clamp((te - .5) / .2), rt);
        tagC(p.name, x + 78, y + 10, open || fake);
      }
      // practice balls
      for (const run of r.runs) { const k = (rt - run.at) / run.dur; if (k >= 0 && k <= 1) { const [x, y] = along(toParcel(run.to), k); ctx.save(); ctx.fillStyle = '#ff9f43'; ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } }
      const b = !done && this.ball(r, rt);
      if (b) { FX.halo(b[0], b[1], 28, '#ffd84a', .6); ctx.save(); ctx.fillStyle = '#ffdf5a'; ctx.beginPath(); ctx.arc(b[0], b[1], 14, 0, Math.PI * 2); ctx.fill(); ctx.restore(); FX.every(r, 'tr', .05, () => FX.glitter(b[0], b[1], 1)); }
      // parrot
      let pp = 'parrot0', px = 1000, py = 160;
      if (!r.plain && te > .8 && te < 2.2) { pp = 'parrot1'; const k = ease(clamp((te - .8) / .3)); px = lerp(1000, WHEEL[0] + 40, k); py = lerp(160, WHEEL[1] - 70, k); }
      if (done) pp = 'parrot2';
      drawImg(pp, px, py + Math.sin(rt * 4) * 5, 100);
      // pirate crew
      for (const p of r.players) {
        if (done && p === Wn) continue;
        let pose = 'aim';
        if (r.runs.some(run => run.p === p && rt > run.at && rt < run.at + run.dur)) pose = 'follow';
        if (rt > r.goldAt && te < 0) pose = 'follow';
        if (p === D && te > 0) pose = !r.plain && te > .5 ? 'false' : 'chain';
        if (p === Wn && te > (r.plain ? 1 : 1.5)) pose = 'parrot';
        charImg(p.av, pose, p.kx, p.ky, 120);
        tagC(p.name, p.kx, p.ky + 20, p === Wn && te > 1.5);
      }
      if (done) {
        const k = clamp((rt - r.doneAt) / .4);
        charImg(Wn.av, 'win', 900, 820, 230 * (.6 + .4 * ease(k)));
        tagC(Wn.name, 900, 844, true);
      }
      Wn.x = b ? b[0] : PARCELS[Wn.parcel][0]; Wn.y = b ? b[1] : PARCELS[Wn.parcel][1];
    },

    idle(t) {
      machine(t, 0);
      drawImg('wheelset0', WHEEL[0], WHEEL[1], 90, { rot: t * .5 });
      drawImg('p12', CANNON[0], CANNON[1], 150);
      PARCELS.forEach(([x, y], i) => drawImg(BOXES[i % 5], x, y + 30, 80, { anchor: 'bottom' }));
      const k = (t * .4) % 1, [x, y] = along(toParcel(Math.floor(t * .4) % 10), k); ctx.save(); ctx.fillStyle = '#ff9f43'; ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      drawImg('parrot0', 1000, 160 + Math.sin(t * 4) * 5, 100);
      PIRATES.forEach(([x2, y2], i) => charImg(i, 'aim', x2, y2, 120));
    },
    onFinish(r) { FX.coins(...PARCELS[r.winner.parcel], 24, PARCELS[r.winner.parcel][1] + 60); },
    winBanner: r => '🎁 The treasure parcel is ' + r.winner.name + "'s!",
    winPos: () => ({ x: 900, y: 700 })
  };
})();
