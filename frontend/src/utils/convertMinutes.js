export default function convertCourse(minutes) {
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  h = h < 10 ? '0' + h : h; 
  m = m < 10 ? '0' + m : m; 
  return h + ':' + m + ':00';
}