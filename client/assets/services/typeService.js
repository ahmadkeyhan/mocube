import Api from './Api'

export default {
  fetchTypes () {
    return Api().get('types')
  }
}
