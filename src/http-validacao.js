async function checaStatus(listaURLs){
    const arrStatus= await Promise.all(
            listaURLs.map(async(url)=>{
                try{
            const response = await fetch(url);
            return response.status;
                }catch(erro){
                  return manejaErros(erro);
                }
        })
    )
    return arrStatus;
}



function extraiLinks(arrLinks){
    return arrLinks.map((objetoLink)=>Object.values(objetoLink).join());
}

function manejaErros(erro){
    if(erro.cause.code==="ENOTFOUND"){
        return "link não encontrado"
    }else{
        return "ocorreu um erro"
    }
}

//criar uma função listaValidada
export default async function listaValidada(listaDeLinks){
    //return extraiLinks(listaDeLinks);
    const links =extraiLinks(listaDeLinks);
    const status =await checaStatus(links);
    //console.log(status);
    return listaDeLinks.map((objeto,indice)=>({
        ...objeto,
        status:status[indice]
    }))
}

//[gatinho salsicha](http://gatinhosalsicha.com.br/)