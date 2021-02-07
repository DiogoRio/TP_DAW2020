var Pie = require('../models/resourceTypePieGraph')
var Resource = require('./resource')
var ResourceType = require('./resourceType')
const { updateUserByUsername } = require('./user')

async function updateTypesFromDB(){
    return ResourceType.getAll().then( async (types) => {
        tmp = []
        types.forEach(t => {
            tmp.push(t.type)
        });
        tmp2 = []
        for (let i = 0; i < tmp.length; i++) {
            var count = await Resource.countResourcesByType(tmp[i])
            tmp2.push({
                y:count,
                label:tmp[i]
            })  
        }
        for (let i = 0; i < tmp2.length; i++) {
            await Pie.findOneAndUpdate({label:tmp2[i].label}, {y:tmp2[i].y, label:tmp2[i].label}, {
                new: true,
                upsert: true
              })
        }
    })
}

async function getPieGraphData(){
    return Pie.find({},{_id:0,label:1,y:1})
}


async function getDoughnutGraphData(){
    var types = await ResourceType.getAll()
    var data = []
    for (let i = 0; i < types.length; i++) {
        var d = await Resource.getDownloadsByType(types[i].type)
        data.push(d)
    }
    return data;
}

module.exports.updateTypesFromDB = updateTypesFromDB;
module.exports.getPieGraphData = getPieGraphData;
module.exports.getDoughnutGraphData = getDoughnutGraphData;
