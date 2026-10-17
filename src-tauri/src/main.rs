// Evita que se abra una consola negra en Windows al arrancar (en la versión final).
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    teselas_lib::run();
}
