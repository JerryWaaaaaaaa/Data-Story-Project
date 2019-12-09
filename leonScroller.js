export default function currentBox(cb){
  // let targetPointFactor = 1 //alert the second a box enter screen
  // let targetPointFactor = 0 //alert the second a box leaves screen
  let targetPointFactor = 0.5 //alert the second a box reaches middle


  // next line from: https://stackoverflow.com/a/222847
  let boxes = Array.prototype.slice.call( document.getElementsByClassName("box") );
  // console.log(boxes);
  // let scrollTop = event.target.scrollTop;
  // console.log(scrollTop);
  let targetRec = event.target.getBoundingClientRect();
  // let firstBoxRec = boxes[0].getBoundingClientRect();
  // console.log(firstBoxRec);
  // let midpoint = scrollTop + targetRec.height * targetPointFactor;
  // console.log(midpoint-scrollTop);
  let midpoint = targetRec.height * targetPointFactor;

  boxes.forEach(box=>{
    let boxInContent = box.getBoundingClientRect().top;
    // console.log(box.id, boxInContent);
    if(Math.abs(boxInContent-midpoint) < 50){
       cb(box);
    }
  });

  //
  // let closestBox = boxes.reduce(function(closest, box){
  //   // box.style.color = "black";
  //   let preMid = closest.getBoundingClientRect().top+closest.getBoundingClientRect().height/2;
  //   let preOffset = preMid - firstBoxRec.top;
  //   let preDist = Math.abs(preOffset - midpoint);
  //   let newMid = box.getBoundingClientRect().top+box.getBoundingClientRect().height/2;
  //   let newOffset = newMid - firstBoxRec.top;
  //   let newDist = Math.abs(newOffset - midpoint);
  //   if(newDist < preDist){
  //     return box
  //   }else{
  //     return closest
  //   }
  // }, boxes[0]);
  // return cb(closestBox, boxes);

}
