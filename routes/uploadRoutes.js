import express from "express";
const router = express.Router();

import { uploadmusic ,songInfo,SingleSongInfo,getAllSongs,searchSong,deleteSong, editSong,userInfo,approveSong,getAllUnverifiedSongs,getSongsForAdmin,searchSongForAdmin,downloadCounter,getAdminDashboard,getTrendingSongs,getRandomSongs} from "../controllers/uploadController.js";


router.route("/uploadmusic").post(uploadmusic);
router.route("/songInfo").post(songInfo)
router.route("/singleMusicInfo").post(SingleSongInfo)
router.route("/getallsongs").get(getAllSongs)
router.route("/searchSong").get(searchSong)
router.route("/deleteSong").get(deleteSong)
router.route("/editSong").post(editSong)
router.route("/findUserInfo").post(userInfo)
router.route("/approveSong").post(approveSong)
router.route("/getallunverifiedsongs").get(getAllUnverifiedSongs)
router.route("/getsongsforadmin").post(getSongsForAdmin)
router.route("/searchSongForAdmin").post(searchSongForAdmin)
router.route("/downloadcounter").post(downloadCounter)
router.route("/getAdminDashboard").get(getAdminDashboard)
router.route("/getTrendingSongs").get(getTrendingSongs)
router.route("/getRandomSongs").get(getRandomSongs)





export default router;
