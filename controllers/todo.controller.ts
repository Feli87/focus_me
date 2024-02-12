import { supabase } from "../lib/initSupabase";

async function fetchData() {
	try {
		const { data, error } = await supabase.from("your_table_name").select("*");

		if (error) {
			console.error("Error fetching data:", error);
		} else {
			console.log("Data fetched:", data);
		}
	} catch (error) {
		console.error("Error:", error);
	}
}
