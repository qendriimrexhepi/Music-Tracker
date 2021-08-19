const {
    Bookmark,
    Song
  } = require('../models')
  const _ = require('lodash')
  
  module.exports = {
    async index (req, res) {
      try {
        const userId = req.user.id
        const {songId} = req.query
        const where = {
          UserId: userId
        }
        if (songId) {
          where.SongId = songId
        }
        const bookmarks = await Bookmark.findAll({
          where: where,
          include: [
            {
              model: Song
            }
          ]
        })
          .map(bookmark => bookmark.toJSON())
          .map(bookmark => _.extend(
            {},
            bookmark.Song,
            bookmark
          ))
        res.send(bookmarks)
      } catch (err) {
        res.status(500).send({
          error: 'Ka errorr për të fetchuar  bookmarkun'
        })
      }
    },
    async post (req, res) {
      try {
        const userId = req.user.id
        const {songId} = req.body
        const bookmark = await Bookmark.findOne({
          where: {
            SongId: songId,
            UserId: userId
          }
        })
        if (bookmark) {
          return res.status(400).send({
            error: 'Ju tani sapo e keni lën si bookmark'
          })
        }
        const newBookmark = await Bookmark.create({
          SongId: songId,
          UserId: userId
        })
        res.send(newBookmark)
      } catch (err) {
        console.log(err)
        res.status(500).send({
          error: 'Një error ka ndalur për të krijuar bookmarkun'
        })
      }
    },
    async remove (req, res) {
      try {
        const userId = req.user.id
        const {bookmarkId} = req.params
        const bookmark = await Bookmark.findOne({
          where: {
            id: bookmarkId,
            UserId: userId
          }
        })
        if (!bookmark) {
          return res.status(403).send({
            error: 'Ju nuk keni akses në këtëbokmark bookmark'
          })
        }
        await bookmark.destroy()
        res.send(bookmark)
      } catch (err) {
        res.status(500).send({
          error: 'Ka errorr për të fshirë këtë images to delete the bookmark'
        })
      }
    }
  }
  