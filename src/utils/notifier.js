const { generateMessage } = require("./quickUtility");

// const notify = (obj, isNew = false) => {
//     console.log("Trying to notify");
//     try {
//         global.client
//             .sendLinkWithAutoPreview(
//                 process.env.GROUP_ID,
//                 obj.chapterData.link,
//                 generateMessage(obj, isNew)
//             )
//             .then((res) => console.log("resultat :", res));
//     } catch (error) {
//         //Anyway.
//         console.log(error);
//     }
// };

// const notify = await (obj, isNew = false) => {
//     return new Promise((resolve, reject) => {
//         try {
//             await global.client.sendLinkWithAutoPreview(
//                 process.env.GROUP_ID,
//                 obj.chapterData.link,
//                 generateMessage(obj, isNew)
//             );
//             return
//         } catch (error) {

//         }
//     })
// }

const notify = async (obj, isNew = false) => {
    console.log("Trying to notify");
    try {
        let k = await global.client.sendLinkWithAutoPreview(
            process.env.GROUP_ID,
            obj.chapterData.link,
            generateMessage(obj, isNew)
        );
        console.log(k);
    } catch (error) {
        //Anyway.
        console.log(error);
    }
};
module.exports = notify;
