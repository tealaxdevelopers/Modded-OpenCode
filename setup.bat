@echo off
chcp 65001 >nul
title OpenCode Setup Wizard
mode con: cols=78 lines=42
color 0B
setlocal
set "HAS_GITHUB="
set "HAS_BRAVE="
set "HAS_GITHUB_MULTI="

echo.
echo  ============================================
echo    OpenCode Setup Wizard
echo    ~ Fully automated configuration ~
echo  ============================================
echo.

:ask_lang
set "lang="
set /p "lang=  Dil / Language / Yazyk (tr / us / ru): "
if /i "%lang%"=="tr" (call :lang_tr & goto lang_ok)
if /i "%lang%"=="us" (call :lang_us & goto lang_ok)
if /i "%lang%"=="ru" (call :lang_ru & goto lang_ok)
echo  ** type tr, us or ru **
goto ask_lang

:lang_ok
echo.
set "default_username=%USERNAME%"
set /p "username=  %L_USER_ASK% (ENTER = %default_username%): "
if "%username%"=="" set "username=%default_username%"

set "addressing=%L_ADDR_DEF%"
set /p "addressing=  %L_ADDR_ASK% (ENTER = %addressing%): "

echo.
echo  %L_PERSONA_HEAD%
echo  %L_PERSONA_OPT1%
echo  %L_PERSONA_OPT2%
echo  %L_PERSONA_OPT3%
set "persona="
set /p "persona=  %L_PERSONA_ASK% (ENTER = 1): "
if "%persona%"=="" set "persona=1"
if "%persona%"=="2" (set "OC_PERSONA_MODE=remote") else (set "OC_PERSONA_MODE=local")

echo.
echo  %L_GH_INFO%

:ask_ghkey
REM --- setx'te mevcut GitHub key kontrolü ---
set "EXISTING_GH="
for /f "tokens=2*" %%A in ('reg query "HKCU\Environment" /v GITHUB_API_KEY 2^>nul') do set "EXISTING_GH=%%B"
if defined EXISTING_GH (
  echo  %L_KEY_GH_FOUND%
  set "HAS_GITHUB=1"
  goto ask_bravekey
)
set "ghkey="
set /p "ghkey=  %L_GH_ASK%: "
if "%ghkey%"=="" (
  echo  %L_GH_SKIP%
  goto ask_bravekey
)
set "gh_n=0"
set "ghrest=%ghkey%"

:gh_split
set "tok="
for /f "tokens=1* delims=," %%A in ("%ghrest%") do (
  set "tok=%%A"
  set "ghrest=%%B"
)
if "%tok%"=="" goto gh_finish
for /f "tokens=* delims= " %%X in ("%tok%") do set "tok=%%X"
if "%tok%"=="" goto gh_split
call :check_chars tok
if errorlevel 1 (
  echo  %L_BAD_CHARS%
  set "ghkey="
  goto ask_ghkey
)
set /a gh_n+=1
setx GITHUB_API_KEY_%gh_n% "%tok%" >nul
REM NOTE: setx has a 1024-char value limit. Keys longer than this will be silently truncated.
for /f %%L in ('powershell -NoProfile -Command "if('%tok%'.Length -gt 1000){'LONG'}"') do set "KEYLENCHK=%%L"
if "%KEYLENCHK%"=="LONG" echo  [!] Warning: API key may be truncated (setx limit: 1024 chars).
set "KEYLENCHK="
goto gh_split

:gh_finish
if "%gh_n%"=="0" (
  echo  %L_GH_SKIP%
  goto ask_bravekey
)
set "HAS_GITHUB=1"
if "%gh_n%"=="1" (
  setx GITHUB_API_KEY "%tok%" >nul
  REM NOTE: setx has a 1024-char value limit. Keys longer than this will be silently truncated.
  for /f %%L in ('powershell -NoProfile -Command "if('%tok%'.Length -gt 1000){'LONG'}"') do set "KEYLENCHK=%%L"
  if "%KEYLENCHK%"=="LONG" echo  [!] Warning: API key may be truncated (setx limit: 1024 chars).
  set "KEYLENCHK="
) else (
  set "HAS_GITHUB_MULTI=1"
  setx GITHUB_TOKEN_COUNT "%gh_n%" >nul
)
echo  %L_GH_SET1% %gh_n%%L_GH_SET2%
goto ask_bravekey

:ask_bravekey
REM --- setx'te mevcut Brave key kontrolü ---
set "EXISTING_BRAVE="
for /f "tokens=2*" %%A in ('reg query "HKCU\Environment" /v BRAVE_API_KEY 2^>nul') do set "EXISTING_BRAVE=%%B"
if defined EXISTING_BRAVE (
  echo  %L_KEY_BRAVE_FOUND%
  set "HAS_BRAVE=1"
  goto install_start
)
echo.
echo  %L_BRAVE_INFO%
set "bravekey="
set /p "bravekey=  %L_BRAVE_ASK%: "
if "%bravekey%"=="" (
  echo  %L_BRAVE_SKIP%
  goto install_start
)
call :check_chars bravekey
if errorlevel 1 (
  echo  %L_BAD_CHARS%
  goto ask_bravekey
)
setx BRAVE_API_KEY "%bravekey%" >nul
set "HAS_BRAVE=1"
echo  %L_BRAVE_SET%
goto install_start

:install_start
set "target_dir=C:\Users\%username%\.config\opencode"
set "source_dir=%~dp0source"
set "OC_USERNAME=%username%"
set "OC_ADDRESSING=%addressing%"
set "OC_LANGUAGE=%L_LANG_WORD%"
set "OC_TARGET=%target_dir%"
set "OC_SOURCE=%source_dir%"

echo.
echo  ============================================
echo  %L_SUM_HEAD%
echo    %L_USER%:    %username%
echo    %L_ADDR%:   %addressing%
echo    %L_LANG%:    %L_LANG_WORD%
echo    %L_TARG%:  %target_dir%
echo  ============================================
echo.

echo  [1/7] %L_S1%
if not exist "%target_dir%" mkdir "%target_dir%" 2>nul
if not exist "%target_dir%" (
  echo  [!] Error: cannot create directory %target_dir%
  echo      Check permissions or run as administrator.
  goto :eof
)
for %%D in (skills agents commands instructions agent) do (
  if not exist "%target_dir%\%%D" mkdir "%target_dir%\%%D" 2>nul
  if not exist "%target_dir%\%%D" (
    echo  [!] Error: cannot create directory %target_dir%\%%D
    echo      Check permissions or run as administrator.
    goto :eof
  )
)
echo         OK

echo  [2/7] %L_S2%
xcopy "%source_dir%\skills\*" "%target_dir%\skills\" /E /I /Y /Q >nul 2>nul
echo         OK

echo  [3/7] %L_S3%
xcopy "%source_dir%\agents\*" "%target_dir%\agents\" /E /I /Y /Q >nul 2>nul
xcopy "%source_dir%\commands\*" "%target_dir%\commands\" /E /I /Y /Q >nul 2>nul
xcopy "%source_dir%\instructions\*" "%target_dir%\instructions\" /E /I /Y /Q >nul 2>nul
echo         OK

echo  [4/7] %L_S4% (%addressing%, %L_LANG_WORD%)
echo         (handled by build-config)
echo         OK

echo  [5/7] %L_S5% (%username%)
if "%HAS_GITHUB_MULTI%"=="1" set "OC_GH_MULTI=1"
set "OC_PERSONA_MODE=%OC_PERSONA_MODE%"
REM Persist kit root for update-checker (npm packages can't find repo root via import.meta.url)
setx OC_KIT_DIR "%~dp0" >nul 2>nul
where node >nul 2>nul || (echo         node not found & pause & exit /b 1)
node "%~dp0scripts\build-config.mjs"
if errorlevel 1 (echo         ERROR! & pause & exit /b 1)
echo         OK

echo  [6/7] %L_S6%
echo         (handled by build-config)
echo         OK

echo  [7/7] %L_S7%
echo         (handled by build-config)
echo         OK

echo.
echo  ============================================
echo  %L_DONE_HEAD%
echo    %L_USER%:    %username%
echo    %L_ADDR%:   %addressing%
echo    %L_LANG%:    %L_LANG_WORD%
if "%HAS_GITHUB%"=="1" (echo    GitHub API key: OK) else (echo    %L_DONE_NOGH%)
if "%HAS_BRAVE%"=="1" (echo    Brave API key:  OK) else (echo    %L_DONE_NOBRAVE%)
if "%OC_PERSONA_MODE%"=="remote" (echo    Persona: remote) else (echo    Persona: local)
echo  ============================================
echo.
echo  %L_RUN_HINT1%
echo    opencode
echo.
pause
exit /b 0

:check_chars
call set "CHK_VAL=%%%~1%%"
REM Block characters that break cmd/setx parsing (| is valid in base64 keys, so excluded)
powershell -NoProfile -Command "if ($env:CHK_VAL -match '[&<>!^%%]') { exit 1 } elseif ($env:CHK_VAL -match '[\"]') { exit 1 } else { exit 0 }"
exit /b %errorlevel%

:lang_tr
set "L_LANG_WORD=Turkce"
set "L_USER_ASK=Kullanici adin ne?"
set "L_ADDR_ASK=Sana nasil hitap edilsin?"
set "L_ADDR_DEF=Tealax"
set "L_LANG=Dil"
set "L_GH_INFO=Birincil: GitHub API key. Bos birakirsan GitHub MCP kapali kurulur."
set "L_GH_ASK=GitHub API key'ler - birden fazla ise virgulle ayir (ENTER = atla)"
set "L_GH_SKIP=[i] Atlandi. Sonra eklemek icin: setx GITHUB_API_KEY ..."
set "L_GH_SET1=[+] "
set "L_GH_SET2= GitHub anahtari kaydedildi (GITHUB_API_KEY_1..N). Dosyaya yazilmadi."
set "L_BRAVE_INFO=Ikincil: Brave Search API key. Varsa web aramasi acilir."
set "L_BRAVE_ASK=Brave API key (ENTER = atla)"
set "L_BRAVE_SKIP=[i] Atlandi. Brave web aramasi kapali kuruldu."
set "L_BRAVE_SET=[+] BRAVE_API_KEY kaydedildi, brave-search MCP aktif olacak."
set "L_PERSONA_HEAD=Agent persona kaynagi sec:"
set "L_PERSONA_OPT1=  [1] Yerel persona (ag gerektirmez, dahiliVarsayilan)"
set "L_PERSONA_OPT2=  [2] Uzak onerilen persona (sunucudan guncellenebilir)"
set "L_PERSONA_OPT3=  Varsayilan: 1 (yerel)"
set "L_PERSONA_ASK=Secim numarasi"
set "L_BAD_CHARS=[!] Gecersiz karakter algilandi, tekrar gir."
set "L_SUM_HEAD=KURULUM BASLIYOR"
set "L_USER=User"
set "L_ADDR=Hitap"
set "L_TARG=Hedef"
set "L_S1=Klasorler olusturuluyor"
set "L_S2=Skills dosyalari kopyalaniyor"
set "L_S3=Agent, command, instruction, plugin kopyalaniyor"
set "L_S4=Rules.md olusturuluyor"
set "L_S5=opencode.jsonc olusturuluyor"
set "L_S6=Manifest yaziliyor"
set "L_S7=Arastirma skill'ine hitap isleniyor"
set "L_DONE_HEAD=KURULUM TAMAMLANDI!"
set "L_DONE_NOGH=GitHub MCP: kapali - key verilmedi"
set "L_DONE_NOBRAVE=Brave arama: kapali - key verilmedi"
set "L_RUN_HINT1=[*] Baslatmak icin:"
set "L_KEY_GH_FOUND=[+] GitHub API key bulundu — otomatik aktif"
set "L_KEY_BRAVE_FOUND=[+] Brave API key bulundu — otomatik aktif"
goto :eof

:lang_us
set "L_LANG_WORD=English"
set "L_USER_ASK=What is your username?"
set "L_ADDR_ASK=How should the agent address you?"
set "L_ADDR_DEF=Boss"
set "L_LANG=Language"
set "L_GH_INFO=Primary: GitHub API key(s). Leave empty to install GitHub MCP disabled."
set "L_GH_ASK=GitHub API keys - separate multiple with commas (ENTER = skip)"
set "L_GH_SKIP=[i] Skipped. To add later: setx GITHUB_API_KEY ..."
set "L_GH_SET1=[+] "
set "L_GH_SET2= GitHub keys saved (GITHUB_API_KEY_1..N). Not written to any file."
set "L_BRAVE_INFO=Secondary: Brave Search API key. Enables web search if provided."
set "L_BRAVE_ASK=Brave API key (ENTER = skip)"
set "L_BRAVE_SKIP=[i] Skipped. Brave web search installed disabled."
set "L_BRAVE_SET=[+] BRAVE_API_KEY saved, brave-search MCP will be enabled."
set "L_PERSONA_HEAD=Choose agent persona source:"
set "L_PERSONA_OPT1=  [1] Local persona (no network needed, built-in default)"
set "L_PERSONA_OPT2=  [2] Remote recommended persona (updatable from server)"
set "L_PERSONA_OPT3=  Default: 1 (local)"
set "L_PERSONA_ASK=Option number"
set "L_BAD_CHARS=[!] Invalid characters detected, try again."
set "L_SUM_HEAD=STARTING SETUP"
set "L_USER=User"
set "L_ADDR=Addressing"
set "L_TARG=Target"
set "L_S1=Creating folders"
set "L_S2=Copying skill files"
set "L_S3=Copying agents, commands, instructions, plugins"
set "L_S4=Generating rules.md"
set "L_S5=Generating opencode.jsonc"
set "L_S6=Writing manifest"
set "L_S7=Patching addressing into research skill"
set "L_DONE_HEAD=SETUP COMPLETE!"
set "L_DONE_NOGH=GitHub MCP: off - no key given"
set "L_DONE_NOBRAVE=Brave search: off - no key given"
set "L_RUN_HINT1=[*] To launch:"
set "L_KEY_GH_FOUND=[+] GitHub API key found — auto-activated"
set "L_KEY_BRAVE_FOUND=[+] Brave API key found — auto-activated"
goto :eof

:lang_ru
set "L_LANG_WORD=Russkiy"
set "L_USER_ASK=Wawite imya polzovatelya?"
set "L_ADDR_ASK=Kak k vam obrashchatsya?"
set "L_ADDR_DEF=Tealax"
set "L_LANG=Yazyk"
set "L_GH_INFO=Pervichnyy: GitHub API klyuchi. Pustoy propusk = GitHub MCP vyklyuchen."
set "L_GH_ASK=GitHub API klyuchi - neskolko cherez zapyatuyu (ENTER = propustit)"
set "L_GH_SKIP=[i] Propushcheno. Dobavit pozzhe: setx GITHUB_API_KEY ..."
set "L_GH_SET1=[+] "
set "L_GH_SET2= GitHub klyucha sokhraneny (GITHUB_API_KEY_1..N). V fayly ne pishutsya."
set "L_BRAVE_INFO=Vtorichnyy: Brave Search API key. Vklyuchaet veb-poisk."
set "L_BRAVE_ASK=Brave API key (ENTER = propustit)"
set "L_BRAVE_SKIP=[i] Propushcheno. Brave veb-poisk ustanovlen vyklyuchennym."
set "L_BRAVE_SET=[+] BRAVE_API_KEY sokhranen, brave-search MCP budet aktivirovan."
set "L_PERSONA_HEAD=Vyberite istochnik personalii agenta:"
set "L_PERSONA_OPT1=  [1] Lokal'naya personaliya (bez seti, vstroyennyy standart)"
set "L_PERSONA_OPT2=  [2] Udalennaya rekomenduyemaya personaliya (obnovlyayetsya s servera)"
set "L_PERSONA_OPT3=  Po umolchaniyu: 1 (lokal'naya)"
set "L_PERSONA_ASK=Nomer varianta"
set "L_BAD_CHARS=[!] Nedopustimye simvoly, povtorite."
set "L_SUM_HEAD=NACHINAEM USTANOVKU"
set "L_USER=Polzovatel"
set "L_ADDR=Obrashcheniye"
set "L_TARG=Put"
set "L_S1=Sozdayu papki"
set "L_S2=Kopiruyu fayly navykov"
set "L_S3=Kopiruyu agentov, komandy, instruktsii, plaginy"
set "L_S4=Generiruyu rules.md"
set "L_S5=Generiruyu opencode.jsonc"
set "L_S6=Pishu manifest"
set "L_S7=Vnosyu obrashcheniye v navyk issledovaniya"
set "L_DONE_HEAD=USTANOVKA ZAVERSHENA!"
set "L_DONE_NOGH=GitHub MCP: vykl - klyuch ne dan"
set "L_DONE_NOBRAVE=Brave poisk: vykl - klyuch ne dan"
set "L_RUN_HINT1=[*] Zapusk:"
set "L_KEY_GH_FOUND=[+] GitHub API key nayden — avtoaktivirovan"
set "L_KEY_BRAVE_FOUND=[+] Brave API key nayden — avtoaktivirovan"
goto :eof
