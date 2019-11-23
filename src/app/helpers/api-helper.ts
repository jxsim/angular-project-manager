const handleGet = (service, id, cb) => {
  service.get(id).subscribe(cb);
};

const handleGetAll = (service, cb) => {
  service.getAll().subscribe(cb);
};

const handleCreate = (service, dataObject, cb) => {
  service.create(dataObject).subscribe(cb);
};

const handleUpdate = (service, dataObject, cb) => {
  service.update(dataObject).subscribe(cb);
};

const handleEnd = (service, dataObject, cb) => {
  service.end(dataObject).subscribe(cb);
};

const handleDelete = (service, dataObject, cb) => {
  service.delete(dataObject).subscribe(cb);
};

export const API = {
  handleGet, handleGetAll, handleCreate, handleUpdate, handleEnd, handleDelete
};
