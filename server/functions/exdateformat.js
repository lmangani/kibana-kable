var _ = require('lodash');
var Strand = require('../lib/strand');
var getFieldScript = require('../types/search_request').methods.getFieldScript;

module.exports = new Strand('exdateformat', {
  args: [
    {
      name: '_input_',
      types: ['searchRequest']
    },
    {
      name: 'src',
      types: ['string']
    },
    {
      name: 'format',
      types: ['string'],
    },
    {
      name: 'dest',
      types: ['string']
    },
  ],
  help: 'An entirely uselessly slow date formatter. You will never use this as it is solid 10x as slow as say, the regex extractor.',
  fn: function search (args, kblConfig) {

    var output = args._input_;
    var field = getFieldScript(args.src, args._input_);
    output.scripts = output.scripts || {};
    output.scripts[args.dest] = `(function () {
      var dateFormat=function(){var e=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\\1?|[LloSZ]|"[^"]*"|'[^']*'/g,t=/\\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\\b/g,a=/[^-+\dA-Z]/g,m=function(e,t){for(e=String(e),t=t||2;e.length<t;)e="0"+e;return e};return function(d,n,y){var r=dateFormat;if(1!=arguments.length||"[object String]"!=Object.prototype.toString.call(d)||/\d/.test(d)||(n=d,d=void 0),d=d?new Date(d):new Date,isNaN(d))throw SyntaxError("invalid date");n=String(r.masks[n]||n||r.masks["default"]),"UTC:"==n.slice(0,4)&&(n=n.slice(4),y=!0);var s=y?"getUTC":"get",i=d[s+"Date"](),o=d[s+"Day"](),M=d[s+"Month"](),u=d[s+"FullYear"](),l=d[s+"Hours"](),T=d[s+"Minutes"](),h=d[s+"Seconds"](),c=d[s+"Milliseconds"](),g=y?0:d.getTimezoneOffset(),S={d:i,dd:m(i),ddd:r.i18n.dayNames[o],dddd:r.i18n.dayNames[o+7],m:M+1,mm:m(M+1),mmm:r.i18n.monthNames[M],mmmm:r.i18n.monthNames[M+12],yy:String(u).slice(2),yyyy:u,h:l%12||12,hh:m(l%12||12),H:l,HH:m(l),M:T,MM:m(T),s:h,ss:m(h),l:m(c,3),L:m(c>99?Math.round(c/10):c),t:12>l?"a":"p",tt:12>l?"am":"pm",T:12>l?"A":"P",TT:12>l?"AM":"PM",Z:y?"UTC":(String(d).match(t)||[""]).pop().replace(a,""),o:(g>0?"-":"+")+m(100*Math.floor(Math.abs(g)/60)+Math.abs(g)%60,4),S:["th","st","nd","rd"][i%10>3?0:(i%100-i%10!=10)*i%10]};return n.replace(e,function(e){return e in S?S[e]:e.slice(1,e.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"},dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]};

      var result = new Date(${field});
      result = dateFormat(result, '${args.format}')
      return result;
    }())`;


    return output;
  }
});
