import Api from './Api'

export default {
  fetchTypes () {
    return Api().get("/types")
  },
  fetchTypeById (id) {
    return Api().get(`/types/${id}`)
  }
}
