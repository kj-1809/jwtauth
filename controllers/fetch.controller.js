async function fetchController(req, res) {
	return res.status(200).json({ success: "Successful ! " });
}
export { fetchController };
