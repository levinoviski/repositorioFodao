# Trabalho do código back1 </>
Esse projeto foi desenvolvido para conhecimento na
aula do Professor Marcelo para aprimorar o conhecimento em terminais e entender como funciona a validação de links.

# 1. Arquivo "index.js"
Serve como ponto de partida de todos os arquivos, mesmo sendo a parte "simples" do código tem sua importância para o projeto.

# 2. Arquivo "cli.js"
Este arquivo consiste no "bruto" do projeto. é la onde toda a biblioteca é criada e trabalhada para que o projeto ocorra da forma devida, esta biblioteca é criada para abrir arquivos e testar links.

~~~javascript
import pegaArquivo from "./index.js";
import fs from 'fs';
import chalk from 'chalk';
import listaValidada from "./http-validacao.js";

const caminho = process.argv;

async function imprimeLista(valida, resultado, identificador = "") {
    if (valida) {
        console.log(chalk.yellow('Lista de Links'),
            chalk.black.bgGreen(identificador),
            await listaValidada(resultado));
    }else{
        console.log(chalk.yellow('Lista de Links'),
            chalk.black.bgGreen(identificador),
            resultado);
    }

}




async function processaTexto(argumentos) {
    const caminho = argumentos[2];

    const valida = argumentos[3]==="--valida";


    try {
        fs.statSync(caminho)
    }
    catch (erro) {
        if (erro.code === "ENOENT") {
            console.log("Arquivo ou diretório não encontrado!!");
            return;
        }

    }

    if (fs.lstatSync(caminho).isFile()) {
        const resultado = await pegaArquivo(caminho);
        //console.log(chalk.yellow('Lista de Links'),resultado);
        imprimeLista(valida,resultado);
    } else if (fs.lstatSync(caminho).isDirectory()) {
        const arquivos = await fs.promises.readdir(caminho);
        arquivos.forEach(async (nomeDoArquivo) => {
            const lista = await pegaArquivo(`${caminho}/${nomeDoArquivo}`);
            //console.log(`${caminho}/${nomeDoArquivo}`);
            //console.log(lista);
            imprimeLista(valida,lista, nomeDoArquivo);
        })
    }


}

processaTexto(caminho);


~~~


# 3. Arquivo "validação.js" 
Como o próprio nome ja diz, ele é usado para a validação do código. la onde coloca toda parte para que o arquivo "cli.js" ocorra bem. Neste arquivo as funções são criadas todas com um propósito diferente para que todo o retorno dos outros arquivos seja eficiente.

~~~javascript
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
~~~


