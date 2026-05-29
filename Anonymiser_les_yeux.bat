@echo off
setlocal
title Anonymisation des yeux - Cabinet Dr Lakhssassi
cd /d "%~dp0"

echo ============================================================
echo   ANONYMISATION AUTOMATIQUE DES YEUX (avant/apres)
echo ============================================================
echo.

rem --- 1. Trouver Python -------------------------------------------------
set "PYEXE="
where python >nul 2>nul && set "PYEXE=python"
if not defined PYEXE ( where py >nul 2>nul && set "PYEXE=py" )
if not defined PYEXE (
  echo [!] Python n'est pas installe.
  echo     1. Va sur  https://www.python.org/downloads/
  echo     2. Telecharge et installe Python.
  echo     3. IMPORTANT : coche la case "Add Python to PATH" pendant l'install.
  echo     4. Relance ce fichier.
  echo.
  pause
  exit /b
)

rem --- 2. Installer les outils (1re fois seulement) ---------------------
echo Installation des outils (peut prendre 1-2 min la premiere fois)...
%PYEXE% -m pip install --quiet --upgrade opencv-python mediapipe numpy Pillow
echo Outils prets.
echo.

rem --- 3. Choisir le dossier de photos ---------------------------------
echo Une fenetre va s'ouvrir : choisis le dossier qui contient tes photos.
for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; $d=New-Object System.Windows.Forms.FolderBrowserDialog; $d.Description='Choisis le dossier de PHOTOS a anonymiser'; if($d.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK){ $d.SelectedPath }"`) do set "SRC=%%I"

if not defined SRC (
  echo Aucun dossier choisi. Arret.
  pause
  exit /b
)

set "DST=%SRC%_ANONYMISE"
echo.
echo Dossier source  : %SRC%
echo Dossier resultat: %DST%
echo.

rem --- 4. Lancer le floutage (renommage anonyme active) ----------------
set "ANON=1"
%PYEXE% "%~dp0scripts\blur_batch.py" "%SRC%" "%DST%"

echo.
echo ============================================================
echo   TERMINE !
echo   - Tes photos anonymisees sont dans : %DST%
echo   - Ouvre le fichier _A_REPRENDRE.txt pour voir les photos
echo     a finir a la main (double-clique sur "Reprendre_a_la_main.bat").
echo ============================================================
echo.
pause
endlocal
