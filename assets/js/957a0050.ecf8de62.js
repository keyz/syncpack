"use strict";(self.webpackChunksite=self.webpackChunksite||[]).push([[3573],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>y});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},p=Object.keys(e);for(a=0;a<p.length;a++)n=p[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(a=0;a<p.length;a++)n=p[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),l=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=l(e.components);return a.createElement(s.Provider,{value:t},e.children)},m="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,p=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=l(n),u=r,y=m["".concat(s,".").concat(u)]||m[u]||d[u]||p;return n?a.createElement(y,o(o({ref:t},c),{},{components:n})):a.createElement(y,o({ref:t},c))}));function y(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var p=n.length,o=new Array(p);o[0]=u;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[m]="string"==typeof e?e:r,o[1]=i;for(var l=2;l<p;l++)o[l]=n[l];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},7029:(e,t,n)=>{n.d(t,{Z:()=>p});var a=n(7294);const r={pill:"pill_lx6J",gray:"gray_oDNb",red:"red_TkSj",yellow:"yellow_uZjQ",green:"green_VuIk",blue:"blue_niGL",indigo:"indigo_t1co",purple:"purple_wWQZ",pink:"pink_hjd3"};function p(e){let{required:t,optional:n}=e;return a.createElement("p",null,t&&a.createElement("span",{className:`${r.pill} ${r.red}`},"Required"),n&&a.createElement("span",{className:`${r.pill} ${r.gray}`},"Optional"))}},6119:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var a=n(7462),r=(n(7294),n(3905)),p=n(7029);const o={id:"custom-types",title:"customTypes"},i="customTypes object",s={unversionedId:"config/custom-types",id:"config/custom-types",title:"customTypes",description:"Extend syncpack to find and fix versions in your packages which are not available by default. Custom",source:"@site/docs/config/custom-types.mdx",sourceDirName:"config",slug:"/config/custom-types",permalink:"/syncpack/config/custom-types",draft:!1,editUrl:"https://github.com/JamieMason/syncpack/tree/master/site/docs/config/custom-types.mdx",tags:[],version:"current",lastUpdatedBy:"Jamie Mason",lastUpdatedAt:1688334552,formattedLastUpdatedAt:"Jul 2, 2023",frontMatter:{id:"custom-types",title:"customTypes"},sidebar:"docs",previous:{title:"--types",permalink:"/syncpack/option/types"},next:{title:"dependencyTypes",permalink:"/syncpack/config/dependency-types"}},l={},c=[{value:"customTypes[name]",id:"customtypesname",level:2},{value:"customTypes[name].path",id:"customtypesnamepath",level:2},{value:"customTypes[name].strategy",id:"customtypesnamestrategy",level:2}],m={toc:c},d="wrapper";function u(e){let{components:t,...n}=e;return(0,r.kt)(d,(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"customtypes-object"},(0,r.kt)("inlineCode",{parentName:"h1"},"customTypes")," object"),(0,r.kt)(p.Z,{optional:!0,mdxType:"Pills"}),(0,r.kt)("p",null,"Extend syncpack to find and fix versions in your packages which are not available by default. Custom\ntypes behave like any other dependency, so can be included in ",(0,r.kt)("a",{parentName:"p",href:"/syncpack/config/version-groups"},"versionGroups"),"\nor ",(0,r.kt)("a",{parentName:"p",href:"/syncpack/config/semver-groups"},"semverGroups")," etc."),(0,r.kt)("p",null,"The example below adds support for synchronising versions found in:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"The ",(0,r.kt)("a",{parentName:"li",href:"https://docs.npmjs.com/cli/v9/configuring-npm/package-json#engines"},(0,r.kt)("inlineCode",{parentName:"a"},"engines"))," object."),(0,r.kt)("li",{parentName:"ol"},"The ",(0,r.kt)("a",{parentName:"li",href:"https://nodejs.org/api/packages.html#packagemanager"},(0,r.kt)("inlineCode",{parentName:"a"},"packageManager"))," string.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:'title=".syncpackrc"',title:'".syncpackrc"'},'{\n  "customTypes": {\n    "engines": {\n      "path": "engines",\n      "strategy": "versionsByName"\n    },\n    "packageManager": {\n      "path": "packageManager",\n      "strategy": "name@version"\n    }\n  }\n}\n')),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"Syncpack config files also support\n",(0,r.kt)("a",{parentName:"p",href:"https://jamiemason.github.io/syncpack/config-file#typescript-intellisense"},"TypeScript IntelliSense"),".")),(0,r.kt)("h2",{id:"customtypesname"},"customTypes","[","name","]"),(0,r.kt)(p.Z,{required:!0,mdxType:"Pills"}),(0,r.kt)("p",null,"The key of each custom type is its name, this can be used in the following places to toggle when it\nis enabled:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/syncpack/option/types"},(0,r.kt)("inlineCode",{parentName:"a"},"--types"))," and ",(0,r.kt)("a",{parentName:"li",href:"/syncpack/config/dependency-types"},(0,r.kt)("inlineCode",{parentName:"a"},"dependencyTypes")),"."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/syncpack/config/version-groups#dependencytypes"},(0,r.kt)("inlineCode",{parentName:"a"},"versionGroup.dependencyTypes"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/syncpack/config/semver-groups#dependencytypes"},(0,r.kt)("inlineCode",{parentName:"a"},"semverGroup.dependencyTypes")))),(0,r.kt)("h2",{id:"customtypesnamepath"},"customTypes","[","name","]",".path"),(0,r.kt)(p.Z,{required:!0,mdxType:"Pills"}),(0,r.kt)("p",null,"Where the version can be found in each package.json file, such as ",(0,r.kt)("inlineCode",{parentName:"p"},"engines"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"packageManager")," or\n",(0,r.kt)("inlineCode",{parentName:"p"},"some.nested.property"),"."),(0,r.kt)("h2",{id:"customtypesnamestrategy"},"customTypes","[","name","]",".strategy"),(0,r.kt)(p.Z,{required:!0,mdxType:"Pills"}),(0,r.kt)("p",null,"A strategy defines how syncpack needs to read and write dependency names and versions, there are 3\nto choose from:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Name"),(0,r.kt)("th",{parentName:"tr",align:null},"Example"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"name@version")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"pnpm@7.27.0"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"version")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"12.4.2"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"versionsByName")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},'{"pnpm":"7.27.0", "semver": "7.3.8"}'))))))}u.isMDXComponent=!0}}]);