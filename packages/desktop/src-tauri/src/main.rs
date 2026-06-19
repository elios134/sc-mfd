// Empêche une console supplémentaire sous Windows en release — NE PAS RETIRER.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    sc_mfd_desktop_lib::run()
}
