import imageDirectUpload from 'Utilities/directUpload';

const fileUpload = async (file) => {
	if (file && file.length > 0) {
		await Promise.all(
			file?.map((value) =>
				imageDirectUpload(value),
			),
		).then((res) => {
			file = (res.filter(Boolean)?.map(({ data }) => data?.signed_id));
		});
	}
	return new Promise(resolve => {
		resolve(file)
	});
}

export default fileUpload;