// Teselas en el portátil: una ventanita flotante, sin bordes, que vive junto al reloj.
// - Cerrar la ventana solo la esconde; sigue en la bandeja del sistema.
// - Abrir la app otra vez solo muestra la que ya está abierta.
// - Desde la bandeja: abrir, «siempre encima» y salir.

use tauri::{
    menu::{CheckMenuItem, Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager, State, WindowEvent, Wry,
};

struct Bandeja {
    encima: CheckMenuItem<Wry>,
}

fn mostrar(app: &AppHandle) {
    if let Some(w) = app.get_webview_window("main") {
        let _ = w.unminimize();
        let _ = w.show();
        let _ = w.set_focus();
    }
}

/// La app avisa a la bandeja cuando cambia «siempre encima» desde los ajustes.
#[tauri::command]
fn marcar_encima(bandeja: State<Bandeja>, si: bool) {
    let _ = bandeja.encima.set_checked(si);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| mostrar(app)))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--autostart"]),
        ))
        .invoke_handler(tauri::generate_handler![marcar_encima])
        .setup(|app| {
            let abrir = MenuItem::with_id(app, "abrir", "Abrir Teselas", true, None::<&str>)?;
            let encima = CheckMenuItem::with_id(app, "encima", "Siempre encima", true, true, None::<&str>)?;
            let separador = PredefinedMenuItem::separator(app)?;
            let salir = MenuItem::with_id(app, "salir", "Salir", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&abrir, &encima, &separador, &salir])?;

            let encima_menu = encima.clone();
            TrayIconBuilder::with_id("bandeja")
                .icon(app.default_window_icon().cloned().expect("falta el icono"))
                .tooltip("Teselas")
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(move |app, event| match event.id.as_ref() {
                    "abrir" => mostrar(app),
                    "encima" => {
                        let si = encima_menu.is_checked().unwrap_or(true);
                        if let Some(w) = app.get_webview_window("main") {
                            let _ = w.set_always_on_top(si);
                        }
                        let _ = app.emit("siempre-encima", si);
                    }
                    "salir" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        mostrar(tray.app_handle());
                    }
                })
                .build(app)?;

            app.manage(Bandeja { encima });
            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .run(tauri::generate_context!())
        .expect("no se pudo arrancar Teselas");
}
