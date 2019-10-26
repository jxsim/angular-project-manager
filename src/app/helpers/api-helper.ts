const handleCreate = (service, dataObject, cb) => {
  service.create(dataObject).subscribe(cb);
};

const handleUpdate = (service, dataObject, cb) => {
  service.update(dataObject).subscribe(cb);
};

export const API = {
  handleCreate, handleUpdate
};
