import firebase from "./firebase";

const db = firebase.collection("/post");

class PostDataService {
  getAll() {
    return db;
  }
  getOne(field,value){
    return db.where(field, "==", value).get();
  }
  getFilter(field,value,status){
    return db.where(field,'==',value);
  }
  getAllInStatus(status){
    return db.where('status_step','==',status)
  }
  create(tutorial) {
    return db.add(tutorial);
  }

  update(id, value) {
    return db.doc(id).update(value);
  }

  delete(id) {
    return db.doc(id).delete();
  }
}

export default new PostDataService();
