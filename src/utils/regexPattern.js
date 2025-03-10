export default {
  name: /^[a-z0-9A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/i,
  email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
  phoneNumberSearchVie: /^(\+84|84|0|1)([0-9]{0,10})\b$/i,
  phoneNumberVie: /^(\+84|84|0|1)([0-9]{7,10})\b$/i,
  phoneNumberVie_: /^(\+84|84|0|1)([0-9]{7,10})\b$/i,
  listIds: /^\d+(,\d+)*$/i,
  formatdateVie: /^(0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[012])[/]\d{4}$/i,
  invoiceCode: /^[A-Za-zĐ0-9/-]{0,100}$/i,
  rating: /^[1-5]/i,
  number: /^[0-9]*$/i
}
