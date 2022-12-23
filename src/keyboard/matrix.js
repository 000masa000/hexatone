import Point from './point';

export function calculateRotationMatrix(rotation, center) {
  var m = [];

  m[0] = Math.cos(rotation);
  m[1] = Math.sin(rotation);
  m[2] = -m[1];
  m[3] = m[0];
  m[4] = center.x - m[0] * center.x - m[2] * center.y;
  m[5] = center.y - m[1] * center.x - m[3] * center.y;

  return m;
}

export function applyMatrixToPoint(m, p) { /*Array, Point*/
  return new Point(
    m[0] * p.x + m[2] * p.y + m[4],
    m[1] * p.x + m[3] * p.y + m[5]
  );
}
