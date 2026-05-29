@echo off
setlocal
title Reprise manuelle des yeux - Cabinet Dr Lakhssassi
cd /d "%~dp0"

echo ============================================================
echo   REPRISE MANUELLE (tracer le bandeau a la souris)
echo ============================================================
echo.
echo Commandes une fois la photo affichee :
echo   - GLISSER la souris  = tracer un rectangle sur les yeux
echo   - touche  A          = appliquer le flou et passer a la suivante
echo   - touche  P          = proposer une zone automatiquement
echo   - touche  U          = annuler le dernier rectangle
echo   - touche  S          = passer (aucun oeil sur cette photo)
echo   - touche  Q          = quitter
echo.

set "PYEXE="
where python >nul 2>nul && set "PYEXE=python"
if not defined PYEXE ( where py >nul 2>nul && set "PYEXE=py" )
if not defined PYEXE (
  echo [!] Python n'est pas installe. Lance d'abord "Anonymiser_les_yeux.bat".
  pause
  exit /b
)

%PYEXE% -m pip install --quiet --upgrade opencv-python mediapipe numpy Pillow

echo Choisis le dossier ..._ANONYMISE (ou un de ses sous-dossiers comme BOTOX).
for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; $d=New-Object System.Windows.Forms.FolderBrowserDialog; $d.Description='Choisis le dossier a reprendre'; if($d.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK){ $d.SelectedPath }"`) do set "SRC=%%I"

if not defined SRC (
  echo Aucun dossier choisi. Arret.
  pause
  exit /b
)

%PYEXE% "%~dp0scripts\blur_manual.py" "%SRC%"

echo.
echo Termine. Les photos reprises sont enregistrees dans le meme dossier.
pause
endlocal
