const repo='chandrumunisamy/the-gilded-oath';
const releases=`https://github.com/${repo}/releases`;
const api=`https://api.github.com/repos/${repo}/releases/latest`;
const links=[...document.querySelectorAll('[data-download-link]')];
const labels=[...document.querySelectorAll('[data-download-label]')];
const status=document.querySelector('#download-status');
const setTarget=(url)=>links.forEach(link=>link.href=url);
async function connectDownload(){
  try{
    const response=await fetch(api,{headers:{Accept:'application/vnd.github+json'}});
    if(!response.ok)throw new Error(String(response.status));
    const release=await response.json();
    const apk=Array.isArray(release.assets)?release.assets.find(asset=>asset.name.toLowerCase().endsWith('.apk')):null;
    if(!apk)throw new Error('no apk');
    setTarget(apk.browser_download_url);
    const version=release.tag_name||'latest';
    labels.forEach(label=>label.textContent=`Download ${version}`);
    if(status){status.textContent='The newest version is ready.';status.className='download-status ready';}
  }catch{
    setTarget(releases);
    if(status){status.textContent='Open the download page to get the newest version.';status.className='download-status warning';}
  }
}
window.addEventListener('load',()=>window.setTimeout(connectDownload,250),{once:true});
