import cheerio from 'cheerio'
import axios from 'axios'
import { Client } from '@elastic/elasticsearch'
import { postcodes } from './postcodes.js'

const client = new Client({
    cloud: { id: 'dev-customers:dXMtZWFzdC0xLmF3cy5mb3VuZC5pbzo0NDMkMWNlMWQ1ZTEwZjdhNDAxYjg0OTI2YTNiNzZkNTE1YjEkMjViN2U3N2IxYTg5NDc4ZGFjNTIxNDc5MjMzZGZkZTg=' },
    auth: { apiKey: 'MlpvWmdJUUJoWHNGUFdxS1lMLTY6VUxzRVNJTnFSb2VTSXlqYnJzejNkdw==' }
})

export default async function getTowns(){
    //const customers = require('./paths.js');
    const result = []

    const {data} = await axios.get(`https://postcodebyaddress.co.uk/post-towns`)
    const $ = cheerio.load(data)
    const areas = $('.badge').toArray()

    for(let i =0; i< areas.length; i++) {
        result.push(areas[i].children[0].data.split('(')[0].trim())
        //if(i>=10){
        //    break;
        //}
    }

    return result
}

export async function getSpecificTowns(){
    //const postcodes = require('./postcodes.js')
    let newPostcodes = []

    for (let i = 0; i < postcodes.length; i++) {
        let pc = postcodes[i].split(/[0-9]/)[0];
        newPostcodes.push(pc)
    }

    let dedupedPostcodes = newPostcodes.filter(function (value, index, array) { 
        return array.indexOf(value) === index;
      });

    console.log(dedupedPostcodes)

    const { data } = await axios.get(`https://postcodebyaddress.co.uk/post-towns`)
    const $ = cheerio.load(data)
    const areas = $('.badge').toArray()
    const result = []
    for (let i = 0; i < areas.length; i++) {
        let area = areas[i].children[0].data;
        //console.log('Area', area)
        let exists = dedupedPostcodes.some((t) => {
            //console.log(area.includes(t))
            return area.includes('(' + t + ')') 
        })

        //console.log('Exists', exists)
        if(exists){
            result.push(area.split('(')[0].trim())
        }
    }

    return result.filter(function (value, index, array) { 
        return array.indexOf(value) === index;
      })

}

export async function elasticSync() {
    //const customers = require('./paths.js');
    const result = []
    const postcodeRegex = /(?<=\().*(?=\))/gm

    const { data } = await axios.get(`https://postcodebyaddress.co.uk/post-towns`)
    const $ = cheerio.load(data)
    const areas = $('.badge').toArray()



    for (let i = 0; i < areas.length; i++) {
        let pc = postcodeRegex.exec(areas[i].children[0].data)
            console.log(`Saving record ${i}`)
            await client.index({
                index: 'post-towns',
                document: {
                    postcode: pc ? pc[0] : areas[i].children[0].data,
                    town: areas[i].children[0].data.split('(')[0].trim(),
                    originalString: areas[i].children[0].data
                }
            })
    }
}