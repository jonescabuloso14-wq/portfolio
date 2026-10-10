const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],R=document.documentElement;
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,sleep=ms=>new Promise(r=>setTimeout(r,ms));
const st={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
let accent="#7C22E0";
/* tema com revelação circular */
function setTheme(t,x,y){
  const ap=()=>{R.dataset.theme=t;st.set("theme",t);accent=getComputedStyle(R).getPropertyValue("--ac").trim()};
  if(!document.startViewTransition||reduced){ap();return}
  const tr=document.startViewTransition(ap);
  tr.ready.then(()=>{const r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
    R.animate({clipPath:[`circle(0 at ${x}px ${y}px)`,`circle(${r}px at ${x}px ${y}px)`]},{duration:750,easing:"ease-in-out",pseudoElement:"::view-transition-new(root)"})}).catch(()=>{});
}
R.dataset.theme=st.get("theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
accent=getComputedStyle(R).getPropertyValue("--ac").trim();
$("#sw").onclick=e=>{const b=e.currentTarget.getBoundingClientRect();setTheme(R.dataset.theme==="dark"?"light":"dark",b.left+b.width/2,b.top+b.height/2)};
/* letras do nome */
$("#nm").innerHTML=[..."JOAO PEDRO"].map((c,k)=>c===" "?" ":`<span style="--k:${k}">${c}</span>`).join("");
$$(".page").forEach(p=>[...p.children].forEach((c,i)=>c.style.setProperty("--i",i)));
/* digitação */
let tok=0;
async function typeLoop(){
  const my=++tok,el=$("#role"),L=["Estudante de TI no Cotemig","Futuro engenheiro de software","Resolvo problemas com tecnologia"];let i=0;
  if(reduced){el.textContent=L[0];return}
  while(my===tok){const w=L[i++%L.length];
    for(let k=1;k<=w.length&&my===tok;k++){el.textContent=w.slice(0,k);await sleep(55)}
    await sleep(1600);
    for(let k=w.length;k>=0&&my===tok;k--){el.textContent=w.slice(0,k);await sleep(28)}
    await sleep(250)}
}
function counters(){$$(".num").forEach(el=>{const n=+el.dataset.n,t0=performance.now();
  (function f(t){const p=Math.min(1,(t-t0)/1400);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)})}
/* navegação por rolagem */
const ids=["home","skills","projetos","contato"];let cur="home",counted=false;
function ind(){const b=$(`[data-go="${cur}"]`);if(!b)return;const i=$("#ind");i.style.left=b.offsetLeft+10+"px";i.style.width=b.offsetWidth-20+"px"}
function setCur(id){cur=id;$$("nav button").forEach(b=>b.classList.toggle("on",b.dataset.go===id));ind()}
function go(id,push=true){const el=$("#"+id);if(!el)return;el.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});if(push)history.replaceState(null,"","#"+id)}
$$("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
addEventListener("hashchange",()=>go(location.hash.slice(1),false));
addEventListener("resize",ind);
addEventListener("scroll",()=>{if(innerHeight+scrollY>=document.body.scrollHeight-4)setCur("contato")},{passive:true});
const rev=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!e.target.classList.contains("in")){e.target.classList.add("in");if(e.target.id==="home"&&!counted){counted=true;counters()}}}),{threshold:.12});
const act=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setCur(e.target.id)}),{rootMargin:"-45% 0px -50% 0px"});
$$(".page").forEach(p=>{rev.observe(p);act.observe(p)});
/* tilt 3D com brilho */
document.addEventListener("pointermove",e=>{
  if(e.pointerType!=="mouse"||reduced)return;
  const el=e.target.closest(".tilt");
  $$(".tilt").forEach(t=>{if(t!==el)t.style.transform=""});
  if(!el)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  el.style.transform=`perspective(800px) rotateY(${(x-.5)*8}deg) rotateX(${(.5-y)*8}deg) translateY(-4px)`;
  el.style.setProperty("--mx",x*100+"%");el.style.setProperty("--my",y*100+"%");
});
document.addEventListener("pointerleave",()=>$$(".tilt").forEach(t=>t.style.transform=""),true);
/* copiar contato */
function toast(m){const t=$("#ts");t.textContent=m;t.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("on"),1800)}
$$(".ct").forEach(b=>b.onclick=async()=>{
  const v=b.dataset.c;
  try{await navigator.clipboard.writeText(v)}catch(e){const a=document.createElement("textarea");a.value=v;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(_){}a.remove()}
  toast("Copiado! ✓");
});
$("#send").onclick=e=>{const b=e.currentTarget;b.textContent="Enviado ✓";toast("Mensagem enviada! ✓");setTimeout(()=>b.textContent="Enviar mensagem",2600)};
setCur("home");typeLoop();if(location.hash)setTimeout(()=>go(location.hash.slice(1),false),150);
