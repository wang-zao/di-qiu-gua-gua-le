// Confetto constructor
export class Confetto {
  public frame: any;
  public outer: any;
  public outerStyle: any;
  public innerStyle: any;
  public inner: any;
  public axis: any;
  public theta: number;
  public dTheta: number;
  public x: number;
  public y: number;
  public dx: number;
  public dy: number;
  public splineX: any;
  public splineY: any;
  eccentricity = 10;
  // Create a 1D Maximal Poisson Disc over [0, 1]
  radius = 1/this.eccentricity;
  radius2 = this.radius+this.radius;
  PI = Math.PI;
  PI2 = this.PI * 2;
  sizeMin = 3;
  sizeMax = 12 - this.sizeMin;
  dThetaMin = .4;
  dThetaMax = .7 - this.dThetaMin;
  deviation = 0;
  dxThetaMin = -.1;
  dxThetaMax = -this.dxThetaMin - this.dxThetaMin;
  dyMin = .13;
  dyMax = .18;


  constructor(theme: any) {
    this.frame = 0;
    this.outer = document.createElement('div');
    this.inner = document.createElement('div');
    this.outer.appendChild(this.inner);
    var outerStyle = this.outer.style, innerStyle = this.inner.style;
    this.outerStyle = outerStyle;
    this.innerStyle = innerStyle;
    outerStyle.position = 'absolute';
    outerStyle.width  = (this.sizeMin + this.sizeMax * Math.random()) + 'px';
    outerStyle.height = (this.sizeMin + this.sizeMax * Math.random()) + 'px';
    innerStyle.width  = '100%';
    innerStyle.height = '100%';
    innerStyle.backgroundColor = theme();
    outerStyle.perspective = '50px';
    outerStyle.transform = 'rotate(' + (360 * Math.random()) + 'deg)';
    this.axis = 'rotate3D(' +
      Math.cos(360 * Math.random()) + ',' +
      Math.cos(360 * Math.random()) + ',0,';
    this.theta = 360 * Math.random();
    this.dTheta = this.dThetaMin + this.dThetaMax * Math.random();
    innerStyle.transform = this.axis + this.theta + 'deg)';
    this.x = (window as any).innerWidth * Math.random();
    this.y = -this.deviation;
    this.dx = Math.sin(this.dxThetaMin + this.dxThetaMax * Math.random());
    this.dy = this.dyMin + this.dyMax * Math.random();
    outerStyle.left = this.x + 'px';
    outerStyle.top  = this.y + 'px';
    // Create the periodic spline
    this.splineX = this.createPoisson();
    this.splineY = [];
    for (var i = 1, l = this.splineX.length-1; i < l; ++i)
      this.splineY[i] = this.deviation * Math.random();
    this.splineY[0] = this.splineY[l] = this.deviation * Math.random();
  }

  // Cosine interpolation
  interpolation(a: number, b: number, t: number) {
    return (1-Math.cos(this.PI*t))/2 * (b-a) + a;
  }

  createPoisson() {
    // domain is the set of points which are still available to pick from
    // D = union{ [d_i, d_i+1] | i is even }
    var domain = [this.radius, 1-this.radius], measure = 1-this.radius2, spline = [0, 1];
    while (measure) {
      var dart = measure * Math.random(), i, l, interval, a, b, c, d;
      // Find where dart lies
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
        a = domain[i], b = domain[i+1], interval = b-a;
        if (dart < measure+interval) {
          spline.push(dart += a-measure);
          break;
        }
        measure += interval;
      }
      c = dart-this.radius, d = dart+this.radius;
      // Update the domain
      for (i = domain.length-1; i > 0; i -= 2) {
        l = i-1, a = domain[l], b = domain[i];
        // c---d          c---d  Do nothing
        //   c-----d  c-----d    Move interior
        //   c--------------d    Delete interval
        //         c--d          Split interval
        //       a------b
        if (a >= c && a < d)
          if (b > d) domain[l] = d; // Move interior (Left case)
          else domain.splice(l, 2); // Delete interval
        else if (a < c && b > c)
          if (b <= d) domain[i] = c; // Move interior (Right case)
          else domain.splice(i, 0, c, d); // Split interval
      }
      // Re-measure the domain
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2)
        measure += domain[i+1]-domain[i];
    }
    return spline.sort();
  }


  update(height: number, delta: number) {
    this.frame += delta;
    this.x += this.dx * delta;
    this.y += this.dy * delta;
    this.theta += this.dTheta * delta;

    // Compute spline and convert to polar
    var phi = this.frame % 7777 / 7777, i = 0, j = 1;
    while (phi >= this.splineX[j]) i = j++;
    var rho = this.interpolation(
      this.splineY[i],
      this.splineY[j],
      (phi-this.splineX[i]) / (this.splineX[j]-this.splineX[i])
    );
    phi *= this.PI2;

    this.outerStyle.left = this.x + rho * Math.cos(phi) + 'px';
    this.outerStyle.top  = this.y + rho * Math.sin(phi) + 'px';
    this.innerStyle.transform = this.axis + this.theta + 'deg)';
    return this.y > height+this.deviation;
  };
}