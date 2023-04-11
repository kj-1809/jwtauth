async function fetchController(req, res) {
	return res.status(200).json({ success: "Successful ! " });
}
// module.exports = { fetchController };
export { fetchController };
