import Owner from "../../models/Owner.js";

export const getOwnerNameById = async (_id) => {    
  const owner = await Owner.findById(_id);
  return owner ? `${owner.name} ${owner.lastName} ${owner.secondLastName}` : null;
}

