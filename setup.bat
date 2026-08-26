@echo off
chcp 65001 >nul
title OpenCode Kurulum Sihirbazi
mode con: cols=72 lines=28
color 0B

echo.
echo  ============================================
echo    OPencode Kurulum Sihirbazi
echo    ~ Tam Otomatik Yapilandirma ~
echo  ============================================
echo.
echo  Bu kurulum su dosyalari olusturacak:
echo    - %%USERPROFILE%%\.config\opencode\rules.md
echo    - %%USERPROFILE%%\.config\opencode\opencode.jsonc
echo    - %%USERPROFILE%%\.config\opencode\skills\ (68 skill)
echo    - %%USERPROFILE%%\.config\opencode\agents\
echo    - %%USERPROFILE%%\.config\opencode\commands\
echo    - %%USERPROFILE%%\.config\opencode\instructions\
echo    - %%USERPROFILE%%\.config\opencode\plugins\
echo.

set "varsayilan_kullanici=%USERNAME%"
echo  ----------------------------------------
set /p "kullanici=  Kullanici adin ne? (ENTER = %varsayilan_kullanici%): "
if "%kullanici%"=="" set "kullanici=%varsayilan_kullanici%"

echo.
set "varsayilan_hitap=Tealax"
set /p "hitap=  Sana nasil hitap edilsin? (ENTER = %varsayilan_hitap%): "
if "%hitap%"=="" set "hitap=%varsayilan_hitap%"

set "hedef=C:\Users\%kullanici%\.config\opencode"
set "kaynak=%~dp0kaynak"

echo.
echo  Baslatiliyor...
echo  Kullanici: %kullanici%
echo  Hitap:    %hitap%
echo  Hedef:    %hedef%
echo.

echo  [1/5] Klasorler olusturuluyor...
if not exist "%hedef%" mkdir "%hedef%" 2>nul
if not exist "%hedef%\skills" mkdir "%hedef%\skills" 2>nul
if not exist "%hedef%\agents" mkdir "%hedef%\agents" 2>nul
if not exist "%hedef%\commands" mkdir "%hedef%\commands" 2>nul
if not exist "%hedef%\instructions" mkdir "%hedef%\instructions" 2>nul
if not exist "%hedef%\plugins" mkdir "%hedef%\plugins" 2>nul
if not exist "%hedef%\agent" mkdir "%hedef%\agent" 2>nul
echo         OK

echo  [2/5] Skills dosyalari kopyalaniyor...
xcopy "%kaynak%\skills\*" "%hedef%\skills\" /E /I /Y /Q >nul 2>nul
echo         OK

echo  [3/5] Diger dosyalar kopyalaniyor...
xcopy "%kaynak%\agents\*" "%hedef%\agents\" /E /I /Y /Q >nul 2>nul
xcopy "%kaynak%\commands\*" "%hedef%\commands\" /E /I /Y /Q >nul 2>nul
xcopy "%kaynak%\instructions\*" "%hedef%\instructions\" /E /I /Y /Q >nul 2>nul
xcopy "%kaynak%\plugins\*" "%hedef%\plugins\" /E /I /Y /Q >nul 2>nul
echo         OK

echo  [4/5] Rules.md olusturuluyor (hitap: %hitap%)...
powershell -Command "$c=(Get-Content '%kaynak%\rules.md' -Raw); $c=$c -replace '{{HITAP_UPPER}}', '%hitap%'; $c=$c -replace '{{HITAP_AI}}', 'T3%hitap%-ai'; $c=$c -replace '{{HITAP}}', '%hitap%'; Set-Content '%hedef%\rules.md' -Value $c"
if %errorlevel% equ 0 (echo         OK) else (echo         HATA! & pause & exit /b 1)

echo  [5/5] opencode.jsonc olusturuluyor (kullanici: %kullanici%)...
powershell -Command "$c=(Get-Content '%kaynak%\opencode.jsonc' -Raw); $c=$c -replace '{{USERNAME}}', '%kullanici%'; Set-Content '%hedef%\opencode.jsonc' -Value $c"
if %errorlevel% equ 0 (echo         OK) else (echo         HATA! & pause & exit /b 1)

if exist "%kaynak%\.agents-opencode-manifest.json" (
  powershell -Command "$c=(Get-Content '%kaynak%\.agents-opencode-manifest.json' -Raw); $c=$c -replace '{{USERNAME}}', '%kullanici%'; Set-Content '%hedef%\.agents-opencode-manifest.json' -Value $c" 2>nul
)

if exist "%hedef%\skills\research\SKILL.md" (
  powershell -Command "$c=(Get-Content '%hedef%\skills\research\SKILL.md' -Raw); $c=$c -replace '{{HITAP}}', '%hitap%'; Set-Content '%hedef%\skills\research\SKILL.md' -Value $c" 2>nul
)

echo.
echo  ============================================
echo    KURULUM TAMAMLANDI!
echo    Kullanici: %kullanici%
echo    Hitap:    %hitap%
echo  ============================================
echo.
pause
