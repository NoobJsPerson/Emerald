// used errors
const errors = ["missing ';'","expected '=' in deceleration"];
// used regexs
const strRegex = /^("[^"]+"|'[^']+')$/;
// used functions
function checkDecleration(words){
  if(words[2] != "=") throw new SyntaxError(atline(errors[1], i));
}
Map.prototype.find = function(fn) {
  return Array.from(this).find(fn);
};
function atline(str,i) {
  return `${str} at line ${i}`;
}
function required(a, b, i) {
  return atline(`this function requires ${a} argument${a > 1 ? 's' :''} and got ${b}`,i);
}
function run(code = document.getElementById("input").value, vars = new Map([
    ["log",{type:"native", code: console.log}],
    ["prompt",{type:"native"}]
    ])) {
  let i = 0;
  code.split("\n").forEach((line,index) =>{
    i++
    if(!line.endsWith(";")) throw SyntaxError(atline(errors[0],i));
    const words = line.split(" "),
          keyword = words[0];
    let usesKeyword = true;
    switch(keyword){
      // declaration keywords
      case "int": {
        checkDecleration(words);
        let value = Number(words[3].slice(0,-1));
        if(isNaN(value) || value % 1) throw new TypeError(atline("value must be an integer",i));
        vars.set(words[1],{type:"int",value});
        break;
      }
      case "float": {
        checkDecleration(words);
        let value = Number(words[3].slice(0,-1));
        if(isNaN(value) || value * 10000000 % 1) throw new TypeError(atline("value must be a float",i));
        vars.set(words[1],{type:"float",value});
        break;
      }
      default:
          usesKeyword = false;
    }
    if(usesKeyword) return;
    const variable = vars.find(x => new RegExp(`${x[0]}(?:\(.+\)|);$`).test(line));
    if(!variable) throw new ReferenceError(atline(`${line.split(/\W/)[0]} is not defined`,i));
    let parameters = [];
    line.match(/\((.+)\)/)?.[1].split(",").forEach(x => {
      if(!x) return;
      if(strRegex.test(x)) return parameters.push(x.match(strRegex)[1]);
      if(Number(x)) return parameters.push(x);
      if(vars.get(x)) parameters.push(vars.get(x).value);
      else throw new ReferenceError(atline (`${x} is not defined`,i));
    });
    switch(variable[1].type){
      case "native":
        if(!parameters.length) throw new Error(required(1,0,i));
        variable[1].code(...parameters);
      case "function":
    }
  });
  console.log("[Program Ended]");
}