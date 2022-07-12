
export const sortFields = (data, type, order, fieldType="string") => {
	// console.log("sortFields");
	// console.log("type",type);
	// console.log("order",order);
	// console.log("fieldType",fieldType);
	// console.log("data",data);

  let output = data.sort( (a,b) => {
  	// console.log("a,b", a, b);
  	// console.log("a[type]",a[type]);
  	// console.log("b[type]",b[type]);

  	let data1 = a[type];
  	let data2 = b[type];

  	if ( fieldType === "string" ) {
  		if ( data1 ) { data1 = data1.toLowerCase(); }
			if ( data2 ) { data2 = data2.toLowerCase(); }
  	}

    if (data1 < data2) { return -1; }
    if (data1 > data2) { return 1; }
    return 0;
  });

  if ( order === 'desc' ) {
  	output = output.reverse();
  }

  return output;

}








