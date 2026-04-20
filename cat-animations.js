(function() {
    if (window.catAnimationsLoaded) return;
    window.catAnimationsLoaded = true;
    
    const waitForCat = setInterval(() => {
        if (window.normalPose && window.catContainer) {
            clearInterval(waitForCat);
            initAnimations();
        }
    }, 50);
    
    function initAnimations() {
        console.log('Анимации запущены!');
        
        
        let typingTimer = null; // Таймер для отслеживания окончания печати
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        let mouseStopTimeout = null;
        let trackingActive = true;
        let currentMouseX = 0, currentMouseY = 0;
        
        let lastAnimationIndex = -1;
        
        let isAnimating = false;
        let lastTypingTime = 0;
        let isYawning = false;
        
        const np = window.normalPose;
        
        const funnyPhrases = [
"Моя бабушка быстрее печатает!",
"Я быстрее лапой набираю!",
"Где твои пальцы?",
"Печатай как ветер!",
"Это всё, на что ты способен?",
"Мяу! Жми быстрее!",
"Слишком медленно, человек!",
"Я заснул, пока ты печатал...",
"Улитка быстрее ползёт!",
"Тренируйся ещё!",
"Мой хвост быстрее двигается!",
"Ты печатаешь или спишь?",
"Скорость улитки, честное слово!",
"Пальцы разморозь!",
"Клавиши не кусаются, жми!",
"Давай-давай, я жду!",
"Ты сегодня кушал? Сил нет печатать?",
"Эй, я же кот! Не обижай!",
"Я маленький, меня нельзя обижать!",
"Ну хватит, я обижусь!",
"Не трогай кота, а то поцарапаю!",
"Я тебе доверял, а ты...",
"Котики не прощают обид!",
"Всё, я в домике!",
"Обидно, между прочим!",
"Ты зачем кота расстраиваешь?",
"Не обижай, а то уйду!"
        ];
        
        // ========== МУХА ==========
        const flyElement = document.createElement('div');
        flyElement.style.cssText = `
            position: fixed;
            width: 24px;
            height: 24px;
            z-index: 999998;
            pointer-events: none;
            display: none;
        `;
        flyElement.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <ellipse cx="8" cy="12" rx="6" ry="4" fill="none" stroke="#222" stroke-width="1.5"/>
                <ellipse cx="16" cy="12" rx="6" ry="4" fill="none" stroke="#222" stroke-width="1.5"/>
                <ellipse cx="12" cy="12" rx="3" ry="2" fill="#222"/>
            </svg>
        `;
        document.body.appendChild(flyElement);
        
        let flyActive = false;
        let flyX = 0, flyY = 0;
        let flyInterval = null;
        
        // ========== СЛЕЖЕНИЕ ЗА КУРСОРОМ (ГЛАЗА + УШИ) ==========
        /*function updatePupilsAndEars(mouseX, mouseY) {
            if (isDragging || !np || isAnimating) return;
            
            const catRect = window.catContainer.getBoundingClientRect();
            const catCenterX = catRect.left + catRect.width / 2;
            const catCenterY = catRect.top + catRect.height / 2;
            
            let dx = (mouseX - catCenterX) / 20;
            let dy = (mouseY - catCenterY) / 20;
            
            const maxOffset = np.leftEyeRx - np.leftPupilR - 2;
            dx = Math.max(-maxOffset, Math.min(maxOffset, dx));
            dy = Math.max(-maxOffset, Math.min(maxOffset, dy));
            
            window.leftPupil.setAttribute("cx", np.leftPupilCx + dx);
            window.leftPupil.setAttribute("cy", np.leftPupilCy + dy);
            window.rightPupil.setAttribute("cx", np.rightPupilCx + dx);
            window.rightPupil.setAttribute("cy", np.rightPupilCy + dy);
            
            window.leftHighlight.setAttribute("cx", np.leftHighCx + dx * 0.7);
            window.leftHighlight.setAttribute("cy", np.leftHighCy + dy * 0.7);
            window.rightHighlight.setAttribute("cx", np.rightHighCx + dx * 0.7);
            window.rightHighlight.setAttribute("cy", np.rightHighCy + dy * 0.7);
            
            // УШИ НАКЛОНЯЮТСЯ
            const earTilt = dx * 0.8;
            const limitedEarTilt = Math.max(-15, Math.min(15, earTilt));
            
            window.leftEar.setAttribute("transform", `rotate(${limitedEarTilt}, 102, 170)`);
            window.leftEarInner.setAttribute("transform", `rotate(${limitedEarTilt}, 104, 167)`);
            window.rightEar.setAttribute("transform", `rotate(${limitedEarTilt}, 178, 168)`);
            window.rightEarInner.setAttribute("transform", `rotate(${limitedEarTilt}, 176, 165)`);
        }*/
        function updatePupilsAndEars(mouseX, mouseY) {
    if (isDragging || !np || isAnimating) return;
    
    const catRect = window.catContainer.getBoundingClientRect();
    const catCenterX = catRect.left + catRect.width / 2;
    const catCenterY = catRect.top + catRect.height / 2;
    
    let dx = (mouseX - catCenterX) / 20;
    let dy = (mouseY - catCenterY) / 20;
    
    const maxOffset = np.leftEyeRx - np.leftPupilR - 2;
    dx = Math.max(-maxOffset, Math.min(maxOffset, dx));
    dy = Math.max(-maxOffset, Math.min(maxOffset, dy));
    
    // ВАЖНО: используем текущие координаты глаз, а не np!
    const currentLeftEyeCy = isYawning ? np.leftEyeCy - 18 : np.leftEyeCy;
    const currentRightEyeCy = isYawning ? np.rightEyeCy - 18 : np.rightEyeCy;
    
    window.leftPupil.setAttribute("cx", np.leftPupilCx + dx);
    window.leftPupil.setAttribute("cy", currentLeftEyeCy + dy);
    window.rightPupil.setAttribute("cx", np.rightPupilCx + dx);
    window.rightPupil.setAttribute("cy", currentRightEyeCy + dy);
    
    window.leftHighlight.setAttribute("cx", np.leftHighCx + dx * 0.7);
    window.leftHighlight.setAttribute("cy", (isYawning ? np.leftHighCy - 18 : np.leftHighCy) + dy * 0.7);
    window.rightHighlight.setAttribute("cx", np.rightHighCx + dx * 0.7);
    window.rightHighlight.setAttribute("cy", (isYawning ? np.rightHighCy - 18 : np.rightHighCy) + dy * 0.7);
    
    // УШИ НАКЛОНЯЮТСЯ (без изменений)
    const earTilt = dx * 0.8;
    const limitedEarTilt = Math.max(-15, Math.min(15, earTilt));
    
    window.leftEar.setAttribute("transform", `rotate(${limitedEarTilt}, 102, 170)`);
    window.leftEarInner.setAttribute("transform", `rotate(${limitedEarTilt}, 104, 167)`);
    window.rightEar.setAttribute("transform", `rotate(${limitedEarTilt}, 178, 168)`);
    window.rightEarInner.setAttribute("transform", `rotate(${limitedEarTilt}, 176, 165)`);
}
        
        function resetPupilsAndEars() {
            if (!np) return;
            
            window.leftPupil.setAttribute("cx", np.leftPupilCx);
            window.leftPupil.setAttribute("cy", np.leftPupilCy);
            window.rightPupil.setAttribute("cx", np.rightPupilCx);
            window.rightPupil.setAttribute("cy", np.rightPupilCy);
            window.leftHighlight.setAttribute("cx", np.leftHighCx);
            window.leftHighlight.setAttribute("cy", np.leftHighCy);
            window.rightHighlight.setAttribute("cx", np.rightHighCx);
            window.rightHighlight.setAttribute("cy", np.rightHighCy);
            
            window.leftEar.setAttribute("transform", "");
            window.rightEar.setAttribute("transform", "");
            window.leftEarInner.setAttribute("transform", "");
            window.rightEarInner.setAttribute("transform", "");
        }
        
        // ========== ФУНКЦИЯ ПЕРЕРИСОВКИ ПРИ ЗАХВАТЕ ==========
        window.setDraggingPose = function(dragging) {
    if (!np || isAnimating) return;
    
    if (dragging) {
        const bodyShiftY = 12;
        const newBodyCy = np.bodyCy + bodyShiftY;
        const newBodyRy = np.bodyRy * 1.25;
        const newBodyBottom = newBodyCy + newBodyRy;
        
        window.body.setAttribute("cy", newBodyCy);
        window.body.setAttribute("ry", newBodyRy);
        window.shadow.setAttribute("cy", np.shadowCy + bodyShiftY + 8);
        window.backLegLeft.setAttribute("cy", np.backLegLeftCy + bodyShiftY + 8);
        window.backLegRight.setAttribute("cy", np.backLegRightCy + bodyShiftY + 8);
        
        const armStartY = newBodyBottom - 5;
        const armEndY = newBodyBottom + 12;
        
        window.leftArm.setAttribute("y1", armStartY);
        window.leftArm.setAttribute("y2", armEndY);
        window.rightArm.setAttribute("y1", armStartY);
        window.rightArm.setAttribute("y2", armEndY);
        window.leftPaw.setAttribute("cy", armEndY);
        window.rightPaw.setAttribute("cy", armEndY);
        
        window.tail.setAttribute("d", `M 140,${newBodyCy} Q 190,${newBodyCy + 10} 220,${newBodyCy} Q 240,${newBodyCy - 10} 230,${newBodyCy - 20}`);
        
        const faceShiftY = 18;
        window.leftEye.setAttribute("cy", np.leftEyeCy + faceShiftY);
        window.rightEye.setAttribute("cy", np.rightEyeCy + faceShiftY);
        window.leftPupil.setAttribute("cy", np.leftPupilCy + faceShiftY);
        window.rightPupil.setAttribute("cy", np.rightPupilCy + faceShiftY);
        window.leftHighlight.setAttribute("cy", np.leftHighCy + faceShiftY);
        window.rightHighlight.setAttribute("cy", np.rightHighCy + faceShiftY);
        
        window.nose.setAttribute("points", `140,${283 + faceShiftY} 147,${283 + faceShiftY} 143,${288 + faceShiftY}`);
        window.mouth.setAttribute("d", `M 136,${297 + faceShiftY} Q 143,${303 + faceShiftY} 150,${297 + faceShiftY}`);
        window.whiskers.setAttribute("d", `M 102,${275 + faceShiftY} L 57,${270 + faceShiftY} M 102,${283 + faceShiftY} L 57,${285 + faceShiftY} M 178,${273 + faceShiftY} L 222,${267 + faceShiftY} M 178,${281 + faceShiftY} L 222,${283 + faceShiftY}`);
        
        window.catContainer.classList.add('dragging');
    } else {
        window.head.setAttribute("cx", np.headCx);
        window.head.setAttribute("cy", np.headCy);
        window.head.setAttribute("rx", np.headRx);
        window.head.setAttribute("ry", np.headRy);
        
        window.body.setAttribute("cy", np.bodyCy);
        window.body.setAttribute("rx", np.bodyRx);
        window.body.setAttribute("ry", np.bodyRy);
        window.shadow.setAttribute("cy", np.shadowCy);
        window.backLegLeft.setAttribute("cy", np.backLegLeftCy);
        window.backLegRight.setAttribute("cy", np.backLegRightCy);
        
        window.leftArm.setAttribute("x1", np.leftArmX1);
        window.leftArm.setAttribute("y1", np.leftArmY1);
        window.leftArm.setAttribute("x2", np.leftArmX2);
        window.leftArm.setAttribute("y2", np.leftArmY2);
        window.rightArm.setAttribute("x1", np.rightArmX1);
        window.rightArm.setAttribute("y1", np.rightArmY1);
        window.rightArm.setAttribute("x2", np.rightArmX2);
        window.rightArm.setAttribute("y2", np.rightArmY2);
        
        window.leftPaw.setAttribute("cx", np.leftPawCx);
        window.leftPaw.setAttribute("cy", np.leftPawCy);
        window.rightPaw.setAttribute("cx", np.rightPawCx);
        window.rightPaw.setAttribute("cy", np.rightPawCy);
        
        window.tail.setAttribute("d", np.tailD);
        
        window.leftEye.setAttribute("cy", np.leftEyeCy);
        window.rightEye.setAttribute("cy", np.rightEyeCy);
        window.leftPupil.setAttribute("cx", np.leftPupilCx);
        window.leftPupil.setAttribute("cy", np.leftPupilCy);
        window.rightPupil.setAttribute("cx", np.rightPupilCx);
        window.rightPupil.setAttribute("cy", np.rightPupilCy);
        window.leftHighlight.setAttribute("cx", np.leftHighCx);
        window.leftHighlight.setAttribute("cy", np.leftHighCy);
        window.rightHighlight.setAttribute("cx", np.rightHighCx);
        window.rightHighlight.setAttribute("cy", np.rightHighCy);
        
        window.nose.setAttribute("points", np.nosePoints);
        window.mouth.setAttribute("d", np.mouthD);
        window.whiskers.setAttribute("d", np.whiskersD);
        
        window.catContainer.classList.remove('dragging');
    }
};
        // ========== ПЕРЕМЕЩЕНИЕ КОТА ==========
        window.catContainer.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || isAnimating) return;
            e.preventDefault();
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = window.catContainer.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            window.setDraggingPose(true);
            
            const onMouseMove = (e) => {
                if (!isDragging) return;
                
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                let newLeft = startLeft + dx;
                let newTop = startTop + dy;
                
                newLeft = Math.max(0, Math.min(window.innerWidth - rect.width, newLeft));
                newTop = Math.max(0, Math.min(window.innerHeight - rect.height, newTop));
                
                window.catContainer.style.left = newLeft + 'px';
                window.catContainer.style.top = newTop + 'px';
                window.catContainer.style.right = 'auto';
                window.catContainer.style.bottom = 'auto';
            };
            
            const onMouseUp = () => {
                isDragging = false;
                window.setDraggingPose(false);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        
        // ========== СЛЕЖЕНИЕ ЗА МЫШКОЙ ==========
        document.addEventListener('mousemove', (e) => {
            currentMouseX = e.clientX;
            currentMouseY = e.clientY;
            
            if (isDragging || isAnimating) return;
            
            if (mouseStopTimeout) clearTimeout(mouseStopTimeout);
            
            trackingActive = true;
            updatePupilsAndEars(e.clientX, e.clientY);
            
            mouseStopTimeout = setTimeout(() => {
                trackingActive = false;
                resetPupilsAndEars();
            }, 3000);
        });
        
        // ========== ОТСЛЕЖИВАНИЕ ПЕЧАТИ ==========
    /*    document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                lastTypingTime = Date.now();
                
                const targetRect = e.target.getBoundingClientRect();
                updatePupilsAndEars(targetRect.left + targetRect.width / 2, targetRect.top + targetRect.height / 2);
                
                setTimeout(() => {
    if (Date.now() - lastTypingTime >= 2500 && !isAnimating && !isDragging && !flyActive) {
        const phrase = funnyPhrases[Math.floor(Math.random() * funnyPhrases.length)];
        
        // Используем функцию динамического изменения облачка
        if (window.updateSpeechBubble) {
            window.updateSpeechBubble(phrase);
        } else {
            // Fallback
            window.speechText.textContent = phrase;
            const bubbleWidth = Math.max(180, Math.min(260, phrase.length * 9));
            window.bubbleRect.setAttribute("width", bubbleWidth);
            window.bubbleRect.setAttribute("x", 150 - bubbleWidth/2);
        }
        
        window.speechBubble.style.display = "block";
        setTimeout(() => window.speechBubble.style.display = "none", 8000);
    }
}, 4500);
                
            }
        });*/
        document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        lastTypingTime = Date.now();
        
        const targetRect = e.target.getBoundingClientRect();
        updatePupilsAndEars(targetRect.left + targetRect.width / 2, targetRect.top + targetRect.height / 2);
        
        // ВАЖНО: Очищаем предыдущий таймер!
        if (typingTimer) {
            clearTimeout(typingTimer);
            typingTimer = null;
        }
        
        // Создаём НОВЫЙ таймер (только один!)
        typingTimer = setTimeout(() => {
            if (Date.now() - lastTypingTime >= 2500 && !isAnimating && !isDragging && !flyActive) {
                const phrase = funnyPhrases[Math.floor(Math.random() * funnyPhrases.length)];
                
                if (window.updateSpeechBubble) {
                    window.updateSpeechBubble(phrase);
                } else {
                    window.speechText.textContent = phrase;
                    const bubbleWidth = Math.max(180, Math.min(260, phrase.length * 9));
                    window.bubbleRect.setAttribute("width", bubbleWidth);
                    window.bubbleRect.setAttribute("x", 150 - bubbleWidth/2);
                }
                
                window.speechBubble.style.display = "block";
                
                // Скрываем через 8 секунд
                setTimeout(() => {
                    window.speechBubble.style.display = "none";
                }, 8000);
            }
            typingTimer = null;
        }, 4500);
    }
});
        
        // ========== АНИМАЦИИ ==========


// ========== НОВАЯ АНИМАЦИЯ 1: ТЕЛО РАСТЯГИВАЕТСЯ ВВЕРХ ==========
function stretchUpAnimation() {
    return new Promise((resolve) => {
        isAnimating = true;
        
        const originalBodyRy = np.bodyRy;
        const originalBodyCy = np.bodyCy;
        const originalHeadCy = np.headCy;
        const originalLeftArmY1 = np.leftArmY1;
        const originalLeftArmY2 = np.leftArmY2;
        const originalRightArmY1 = np.rightArmY1;
        const originalRightArmY2 = np.rightArmY2;
        const originalLeftPawCy = np.leftPawCy;
        const originalRightPawCy = np.rightPawCy;
        
        // Фаза 1: растягивание вверх (500ms)
        const stretchUp = () => {
            // Тело становится овалом и поднимается
            window.body.setAttribute("ry", originalBodyRy * 1.6);
            window.body.setAttribute("cy", originalBodyCy - 25);
            
            // Голова поднимается
            window.head.setAttribute("cy", originalHeadCy - 25);
            
            // Передние лапы подтягиваются вверх
            window.leftArm.setAttribute("y1", originalLeftArmY1 - 20);
            window.leftArm.setAttribute("y2", originalLeftArmY2 - 20);
            window.rightArm.setAttribute("y1", originalRightArmY1 - 20);
            window.rightArm.setAttribute("y2", originalRightArmY2 - 20);
            window.leftPaw.setAttribute("cy", originalLeftPawCy - 20);
            window.rightPaw.setAttribute("cy", originalRightPawCy - 20);
            
            // Глаза смотрят вверх
            window.leftPupil.setAttribute("cy", np.leftPupilCy - 8);
            window.rightPupil.setAttribute("cy", np.rightPupilCy - 8);
            window.leftHighlight.setAttribute("cy", np.leftHighCy - 8);
            window.rightHighlight.setAttribute("cy", np.rightHighCy - 8);
        };
        
        // Фаза 2: возврат (500ms)
        const stretchDown = () => {
            window.body.setAttribute("ry", originalBodyRy);
            window.body.setAttribute("cy", originalBodyCy);
            window.head.setAttribute("cy", originalHeadCy);
            
            window.leftArm.setAttribute("y1", originalLeftArmY1);
            window.leftArm.setAttribute("y2", originalLeftArmY2);
            window.rightArm.setAttribute("y1", originalRightArmY1);
            window.rightArm.setAttribute("y2", originalRightArmY2);
            window.leftPaw.setAttribute("cy", originalLeftPawCy);
            window.rightPaw.setAttribute("cy", originalRightPawCy);
            
            window.leftPupil.setAttribute("cy", np.leftPupilCy);
            window.rightPupil.setAttribute("cy", np.rightPupilCy);
            window.leftHighlight.setAttribute("cy", np.leftHighCy);
            window.rightHighlight.setAttribute("cy", np.rightHighCy);
        };
        
        stretchUp();
        
        setTimeout(() => {
            stretchDown();
            setTimeout(() => {
                isAnimating = false;
                resolve();
            }, 500);
        }, 3000);
    });
}

// ========== НОВАЯ АНИМАЦИЯ 2: ЛАПЫ НА МОНИТОР ==========
function pawsOnMonitorAnimation() {
    return new Promise((resolve) => {
        isAnimating = true;
        
        // Сохраняем оригинальные размеры лап
        const originalLeftArmX2 = np.leftArmX2;
        const originalLeftArmY2 = np.leftArmY2;
        const originalRightArmX2 = np.rightArmX2;
        const originalRightArmY2 = np.rightArmY2;
        const originalLeftPawRx = 8;
        const originalLeftPawRy = 4;
        const originalRightPawRx = 8;
        const originalRightPawRy = 4;
        const originalLeftPawCx = np.leftPawCx;
        const originalLeftPawCy = np.leftPawCy;
        const originalRightPawCx = np.rightPawCx;
        const originalRightPawCy = np.rightPawCy;
        
        // Лапы расширяются на 40 влево/вправо и поднимаются на 80 вверх
        window.leftArm.setAttribute("x2", String(np.leftArmX2 - 40));
        window.leftArm.setAttribute("y2", String(np.leftArmY2 - 80));
        window.rightArm.setAttribute("x2", String(np.rightArmX2 + 40));
        window.rightArm.setAttribute("y2", String(np.rightArmY2 - 80));
        
        // Лапы становятся БОЛЬШИМИ и НЕПРОЗРАЧНЫМИ
        window.leftPaw.setAttribute("rx", "45");
        window.leftPaw.setAttribute("ry", "35");
        window.leftPaw.setAttribute("cx", String(np.leftPawCx - 40));
        window.leftPaw.setAttribute("cy", String(np.leftPawCy - 80));
        window.leftPaw.setAttribute("fill", "#FFFFFF"); // Явно задаём белый цвет
        
        window.rightPaw.setAttribute("rx", "45");
        window.rightPaw.setAttribute("ry", "35");
        window.rightPaw.setAttribute("cx", String(np.rightPawCx + 40));
        window.rightPaw.setAttribute("cy", String(np.rightPawCy - 80));
        window.rightPaw.setAttribute("fill", "#FFFFFF"); // Явно задаём белый цвет
        
        // Кот НЕ уменьшается, а ПРЯЧЕТСЯ за лапами (лапы просто перекрывают его)
        // Но можно немного отодвинуть для эффекта глубины
        window.body.setAttribute("ry", String(np.bodyRy * 0.9));
        window.body.setAttribute("cy", String(np.bodyCy + 3));
        window.head.setAttribute("ry", String(np.headRy * 0.9));
        window.head.setAttribute("cy", String(np.headCy + 3));
        
        // ========== РИСУЕМ ПОДУШЕЧКИ И КОГТИ ==========
        const pawDetailsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        pawDetailsGroup.setAttribute("id", "paw-details");
        
        // ----- ЛЕВАЯ ЛАПА (подушечки) -----
        const leftPawCenterX = np.leftPawCx - 40;
        const leftPawCenterY = np.leftPawCy - 80;
        
        // Белый фон для левой лапы (чтобы точно перекрыть кота)
        const leftPawBackground = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        leftPawBackground.setAttribute("cx", String(leftPawCenterX));
        leftPawBackground.setAttribute("cy", String(leftPawCenterY));
        leftPawBackground.setAttribute("rx", "45");
        leftPawBackground.setAttribute("ry", "35");
        leftPawBackground.setAttribute("fill", "#FFFFFF");
        leftPawBackground.setAttribute("stroke", "#222");
        leftPawBackground.setAttribute("stroke-width", "3");
        pawDetailsGroup.appendChild(leftPawBackground);
        
        // Большая подушечка
        const leftMainPad = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        leftMainPad.setAttribute("cx", String(leftPawCenterX));
        leftMainPad.setAttribute("cy", String(leftPawCenterY + 5));
        leftMainPad.setAttribute("rx", "15");
        leftMainPad.setAttribute("ry", "11");
        leftMainPad.setAttribute("fill", "#FFB6C1");
        leftMainPad.setAttribute("stroke", "#222");
        leftMainPad.setAttribute("stroke-width", "2");
        pawDetailsGroup.appendChild(leftMainPad);
        
        // Три подушечки пальцев
        const leftFingerPositions = [
            { cx: leftPawCenterX - 20, cy: leftPawCenterY - 12 },
            { cx: leftPawCenterX, cy: leftPawCenterY - 18 },
            { cx: leftPawCenterX + 20, cy: leftPawCenterY - 12 }
        ];
        
        leftFingerPositions.forEach(pos => {
            const pad = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
            pad.setAttribute("cx", String(pos.cx));
            pad.setAttribute("cy", String(pos.cy));
            pad.setAttribute("rx", "8");
            pad.setAttribute("ry", "7");
            pad.setAttribute("fill", "#FFB6C1");
            pad.setAttribute("stroke", "#222");
            pad.setAttribute("stroke-width", "2");
            pawDetailsGroup.appendChild(pad);
        });
        
        // Когти на левой лапе
        const leftClawPositions = [
            { x1: leftPawCenterX - 26, y1: leftPawCenterY - 28, x2: leftPawCenterX - 34, y2: leftPawCenterY - 42 },
            { x1: leftPawCenterX, y1: leftPawCenterY - 34, x2: leftPawCenterX, y2: leftPawCenterY - 48 },
            { x1: leftPawCenterX + 26, y1: leftPawCenterY - 28, x2: leftPawCenterX + 34, y2: leftPawCenterY - 42 }
        ];
        
        leftClawPositions.forEach(pos => {
            const claw = document.createElementNS("http://www.w3.org/2000/svg", "line");
            claw.setAttribute("x1", String(pos.x1));
            claw.setAttribute("y1", String(pos.y1));
            claw.setAttribute("x2", String(pos.x2));
            claw.setAttribute("y2", String(pos.y2));
            claw.setAttribute("stroke", "#999");
            claw.setAttribute("stroke-width", "4");
            claw.setAttribute("stroke-linecap", "round");
            pawDetailsGroup.appendChild(claw);
        });
        
        // ----- ПРАВАЯ ЛАПА (подушечки) -----
        const rightPawCenterX = np.rightPawCx + 40;
        const rightPawCenterY = np.rightPawCy - 80;
        
        // Белый фон для правой лапы (чтобы точно перекрыть кота)
        const rightPawBackground = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        rightPawBackground.setAttribute("cx", String(rightPawCenterX));
        rightPawBackground.setAttribute("cy", String(rightPawCenterY));
        rightPawBackground.setAttribute("rx", "45");
        rightPawBackground.setAttribute("ry", "35");
        rightPawBackground.setAttribute("fill", "#FFFFFF");
        rightPawBackground.setAttribute("stroke", "#222");
        rightPawBackground.setAttribute("stroke-width", "3");
        pawDetailsGroup.appendChild(rightPawBackground);
        
        // Большая подушечка
        const rightMainPad = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        rightMainPad.setAttribute("cx", String(rightPawCenterX));
        rightMainPad.setAttribute("cy", String(rightPawCenterY + 5));
        rightMainPad.setAttribute("rx", "15");
        rightMainPad.setAttribute("ry", "11");
        rightMainPad.setAttribute("fill", "#FFB6C1");
        rightMainPad.setAttribute("stroke", "#222");
        rightMainPad.setAttribute("stroke-width", "2");
        pawDetailsGroup.appendChild(rightMainPad);
        
        // Три подушечки пальцев
        const rightFingerPositions = [
            { cx: rightPawCenterX - 20, cy: rightPawCenterY - 12 },
            { cx: rightPawCenterX, cy: rightPawCenterY - 18 },
            { cx: rightPawCenterX + 20, cy: rightPawCenterY - 12 }
        ];
        
        rightFingerPositions.forEach(pos => {
            const pad = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
            pad.setAttribute("cx", String(pos.cx));
            pad.setAttribute("cy", String(pos.cy));
            pad.setAttribute("rx", "8");
            pad.setAttribute("ry", "7");
            pad.setAttribute("fill", "#FFB6C1");
            pad.setAttribute("stroke", "#222");
            pad.setAttribute("stroke-width", "2");
            pawDetailsGroup.appendChild(pad);
        });
        
        // Когти на правой лапе
        const rightClawPositions = [
            { x1: rightPawCenterX - 26, y1: rightPawCenterY - 28, x2: rightPawCenterX - 34, y2: rightPawCenterY - 42 },
            { x1: rightPawCenterX, y1: rightPawCenterY - 34, x2: rightPawCenterX, y2: rightPawCenterY - 48 },
            { x1: rightPawCenterX + 26, y1: rightPawCenterY - 28, x2: rightPawCenterX + 34, y2: rightPawCenterY - 42 }
        ];
        
        rightClawPositions.forEach(pos => {
            const claw = document.createElementNS("http://www.w3.org/2000/svg", "line");
            claw.setAttribute("x1", String(pos.x1));
            claw.setAttribute("y1", String(pos.y1));
            claw.setAttribute("x2", String(pos.x2));
            claw.setAttribute("y2", String(pos.y2));
            claw.setAttribute("stroke", "#999");
            claw.setAttribute("stroke-width", "4");
            claw.setAttribute("stroke-linecap", "round");
            pawDetailsGroup.appendChild(claw);
        });
        
        // Скрываем оригинальные лапы, чтобы они не просвечивали
        window.leftPaw.style.display = "none";
        window.rightPaw.style.display = "none";
        window.leftArm.style.display = "none";
        window.rightArm.style.display = "none";
        
        window.catGroup.appendChild(pawDetailsGroup);
        
        setTimeout(() => {
            // Удаляем кастомные лапы
            pawDetailsGroup.remove();
            
            // Показываем оригинальные лапы
            window.leftPaw.style.display = "";
            window.rightPaw.style.display = "";
            window.leftArm.style.display = "";
            window.rightArm.style.display = "";
            
            // Возвращаем оригинальные параметры
            window.leftArm.setAttribute("x2", originalLeftArmX2);
            window.leftArm.setAttribute("y2", originalLeftArmY2);
            window.rightArm.setAttribute("x2", originalRightArmX2);
            window.rightArm.setAttribute("y2", originalRightArmY2);
            
            window.leftPaw.setAttribute("rx", originalLeftPawRx);
            window.leftPaw.setAttribute("ry", originalLeftPawRy);
            window.leftPaw.setAttribute("cx", originalLeftPawCx);
            window.leftPaw.setAttribute("cy", originalLeftPawCy);
            
            window.rightPaw.setAttribute("rx", originalRightPawRx);
            window.rightPaw.setAttribute("ry", originalRightPawRy);
            window.rightPaw.setAttribute("cx", originalRightPawCx);
            window.rightPaw.setAttribute("cy", originalRightPawCy);
            
            window.body.setAttribute("ry", String(np.bodyRy));
            window.body.setAttribute("cy", String(np.bodyCy));
            window.head.setAttribute("ry", String(np.headRy));
            window.head.setAttribute("cy", String(np.headCy));
            
            setTimeout(() => {
                isAnimating = false;
                resolve();
            }, 400);
        }, 3000);
    });
}
// ========== НОВАЯ АНИМАЦИЯ 3: КОТ УХОДИТ ВГЛУБЬ ЭКРАНА ==========
/*function walkAwayAnimation() {
    return new Promise((resolve) => {
        isAnimating = true;
        
        const originalTransform = window.catGroup.getAttribute("transform") || "";
        const startScale = 1;
        const endScale = 0.1;
        const steps = 25;
        let step = 0;
        
        // Сохраняем оригинальные параметры
        const originalHeadCx = np.headCx;
        const originalHeadCy = np.headCy;
        const originalHeadRx = np.headRx;
        const originalHeadRy = np.headRy;
        const originalBodyCx = np.bodyCx;
        const originalBodyCy = np.bodyCy;
        const originalBodyRx = np.bodyRx;
        const originalBodyRy = np.bodyRy;
        const originalTailD = np.tailD;
        
        // Прячем переднюю часть кота (морду, глаза, нос, рот, усы)
        window.leftEye.style.display = "none";
        window.rightEye.style.display = "none";
        window.leftPupil.style.display = "none";
        window.rightPupil.style.display = "none";
        window.leftHighlight.style.display = "none";
        window.rightHighlight.style.display = "none";
        window.nose.style.display = "none";
        window.mouth.style.display = "none";
        window.whiskers.style.display = "none";
        window.leftEar.style.display = "none";
        window.rightEar.style.display = "none";
        window.leftEarInner.style.display = "none";
        window.rightEarInner.style.display = "none";
        
        // Прячем передние лапы
        window.leftArm.style.display = "none";
        window.rightArm.style.display = "none";
        window.leftPaw.style.display = "none";
        window.rightPaw.style.display = "none";
        
        // Меняем порядок: ГОЛОВА ПОВЕРХ ТЕЛА
        window.catGroup.removeChild(window.head);
        window.catGroup.appendChild(window.head);
        
        // Рисуем ЗАДНЮЮ ЧАСТЬ
        const backGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        backGroup.setAttribute("id", "back-group");
        
        // Тело рисуем ПЕРЕД головой (тело закрывает голову)
        // Но сначала голова, потом тело
        
        // КРЕСТИК (анус) под хвостом
        const crossGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        crossGroup.setAttribute("id", "butt-cross");
        
        const crossLine1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        crossLine1.setAttribute("x1", String(np.bodyCx - 5));
        crossLine1.setAttribute("y1", String(np.bodyCy - 5));
        crossLine1.setAttribute("x2", String(np.bodyCx + 5));
        crossLine1.setAttribute("y2", String(np.bodyCy + 5));
        crossLine1.setAttribute("stroke", "#8B4513");
        crossLine1.setAttribute("stroke-width", "2.5");
        crossLine1.setAttribute("stroke-linecap", "round");
        crossGroup.appendChild(crossLine1);
        
        const crossLine2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        crossLine2.setAttribute("x1", String(np.bodyCx + 5));
        crossLine2.setAttribute("y1", String(np.bodyCy - 5));
        crossLine2.setAttribute("x2", String(np.bodyCx - 5));
        crossLine2.setAttribute("y2", String(np.bodyCy + 5));
        crossLine2.setAttribute("stroke", "#8B4513");
        crossLine2.setAttribute("stroke-width", "2.5");
        crossLine2.setAttribute("stroke-linecap", "round");
        crossGroup.appendChild(crossLine2);
        
        window.catGroup.appendChild(crossGroup);
        
        // ХВОСТ растёт из центра туловища ЧУТЬ ВЫШЕ
        window.tail.setAttribute("d", `M ${np.bodyCx},${np.bodyCy - 8} Q ${np.bodyCx - 40},${np.bodyCy - 30} ${np.bodyCx - 60},${np.bodyCy - 50}`);
        window.tail.setAttribute("stroke-width", "5");
        
        // Задние лапы делаем более заметными
        window.backLegLeft.setAttribute("rx", "22");
        window.backLegLeft.setAttribute("ry", "10");
        window.backLegRight.setAttribute("rx", "22");
        window.backLegRight.setAttribute("ry", "10");
        
        // Анимация уменьшения и ухода
        const animateAway = setInterval(() => {
            if (step < steps) {
                const progress = step / steps;
                const scale = startScale - (startScale - endScale) * progress;
                
                // Уменьшаем размер и двигаем вправо-вниз
                window.catGroup.setAttribute("transform", `scale(${scale}) translate(${progress * 150}, ${progress * 80})`);
                
                // Делаем более прозрачным
                window.catContainer.style.opacity = 1 - progress * 0.8;
                
                step++;
            } else {
                clearInterval(animateAway);
                
                // Возвращаем всё обратно
                setTimeout(() => {
                    window.catGroup.setAttribute("transform", originalTransform);
                    window.catContainer.style.opacity = "1";
                    
                    // Показываем переднюю часть
                    window.leftEye.style.display = "";
                    window.rightEye.style.display = "";
                    window.leftPupil.style.display = "";
                    window.rightPupil.style.display = "";
                    window.leftHighlight.style.display = "";
                    window.rightHighlight.style.display = "";
                    window.nose.style.display = "";
                    window.mouth.style.display = "";
                    window.whiskers.style.display = "";
                    window.leftEar.style.display = "";
                    window.rightEar.style.display = "";
                    window.leftEarInner.style.display = "";
                    window.rightEarInner.style.display = "";
                    
                    // Показываем передние лапы
                    window.leftArm.style.display = "";
                    window.rightArm.style.display = "";
                    window.leftPaw.style.display = "";
                    window.rightPaw.style.display = "";
                    
                    // Удаляем крестик
                    crossGroup.remove();
                    
                    // Возвращаем хвост
                    window.tail.setAttribute("d", originalTailD);
                    window.tail.setAttribute("stroke-width", "4");
                    
                    // Возвращаем задние лапы
                    window.backLegLeft.setAttribute("rx", "18");
                    window.backLegLeft.setAttribute("ry", "8");
                    window.backLegRight.setAttribute("rx", "18");
                    window.backLegRight.setAttribute("ry", "8");
                    
                    // Возвращаем порядок элементов
                    backGroup.remove();
                    
                    isAnimating = false;
                    resolve();
                }, 300);
            }
        }, 150);
    });
}*/

function walkAwayAnimation() {
    return new Promise((resolve) => {
        isAnimating = true;
        
        const originalTransform = window.catGroup.getAttribute("transform") || "";
        const startScale = 1;
        const endScale = 0.1;
        const steps = 25;
        let step = 0;
        
        const originalTailD = np.tailD;
        
        // Прячем переднюю часть
        window.leftEye.style.display = "none";
        window.rightEye.style.display = "none";
        window.leftPupil.style.display = "none";
        window.rightPupil.style.display = "none";
        window.leftHighlight.style.display = "none";
        window.rightHighlight.style.display = "none";
        window.nose.style.display = "none";
        window.mouth.style.display = "none";
        window.whiskers.style.display = "none";
        window.leftEar.style.display = "none";
        window.rightEar.style.display = "none";
        window.leftEarInner.style.display = "none";
        window.rightEarInner.style.display = "none";
        window.leftArm.style.display = "none";
        window.rightArm.style.display = "none";
        window.leftPaw.style.display = "none";
        window.rightPaw.style.display = "none";
        
        // КРЕСТИК (анус) - чуть ниже центра тела
        const crossGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        crossGroup.setAttribute("id", "butt-cross");
        
        const crossX = np.bodyCx;
        const crossY = np.bodyCy + 5; // чуть ниже центра
        
        const crossLine1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        crossLine1.setAttribute("x1", String(crossX - 5));
        crossLine1.setAttribute("y1", String(crossY - 5));
        crossLine1.setAttribute("x2", String(crossX + 5));
        crossLine1.setAttribute("y2", String(crossY + 5));
        crossLine1.setAttribute("stroke", "#8B4513");
        crossLine1.setAttribute("stroke-width", "2.5");
        crossLine1.setAttribute("stroke-linecap", "round");
        crossGroup.appendChild(crossLine1);
        
        const crossLine2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        crossLine2.setAttribute("x1", String(crossX + 5));
        crossLine2.setAttribute("y1", String(crossY - 5));
        crossLine2.setAttribute("x2", String(crossX - 5));
        crossLine2.setAttribute("y2", String(crossY + 5));
        crossLine2.setAttribute("stroke", "#8B4513");
        crossLine2.setAttribute("stroke-width", "2.5");
        crossLine2.setAttribute("stroke-linecap", "round");
        crossGroup.appendChild(crossLine2);
        
        window.catGroup.appendChild(crossGroup);
        
        // ХВОСТ - начинается ЧУТЬ ВЫШЕ КРЕСТИКА и идёт вправо-вверх
        window.tail.setAttribute("d", `M ${crossX},${crossY - 12} Q ${crossX + 40},${crossY - 30} ${crossX + 60},${crossY - 50}`);
        window.tail.setAttribute("stroke-width", "6");
        
        // Задние лапы делаем более заметными
        window.backLegLeft.setAttribute("rx", "20");
        window.backLegLeft.setAttribute("ry", "8");
        window.backLegRight.setAttribute("rx", "20");
        window.backLegRight.setAttribute("ry", "8");
        
        const animateAway = setInterval(() => {
            if (step < steps) {
                const progress = step / steps;
                const scale = startScale - (startScale - endScale) * progress;
                window.catGroup.setAttribute("transform", `scale(${scale}) translate(${progress * 150}, ${progress * 80})`);
                window.catContainer.style.opacity = 1 - progress * 0.8;
                step++;
            } else {
                clearInterval(animateAway);
                setTimeout(() => {
                    window.catGroup.setAttribute("transform", originalTransform);
                    window.catContainer.style.opacity = "1";
                    
                    window.leftEye.style.display = "";
                    window.rightEye.style.display = "";
                    window.leftPupil.style.display = "";
                    window.rightPupil.style.display = "";
                    window.leftHighlight.style.display = "";
                    window.rightHighlight.style.display = "";
                    window.nose.style.display = "";
                    window.mouth.style.display = "";
                    window.whiskers.style.display = "";
                    window.leftEar.style.display = "";
                    window.rightEar.style.display = "";
                    window.leftEarInner.style.display = "";
                    window.rightEarInner.style.display = "";
                    window.leftArm.style.display = "";
                    window.rightArm.style.display = "";
                    window.leftPaw.style.display = "";
                    window.rightPaw.style.display = "";
                    
                    crossGroup.remove();
                    
                    window.tail.setAttribute("d", originalTailD);
                    window.tail.setAttribute("stroke-width", "5");
                    
                    window.backLegLeft.setAttribute("rx", "15");
                    window.backLegLeft.setAttribute("ry", "6");
                    window.backLegRight.setAttribute("rx", "15");
                    window.backLegRight.setAttribute("ry", "6");
                    
                    isAnimating = false;
                    resolve();
                }, 300);
            }
        }, 150);
    });
}
// ========== НОВАЯ АНИМАЦИЯ 4: КОТ ЛИЖЕТ ЛАПУ ==========
/*function lickPawAnimation() {
    return new Promise((resolve) => {
        isAnimating = true;
        
        // Поднимаем правую лапу к лицу
        window.rightArm.setAttribute("x2", np.rightArmX2 - 25);
        window.rightArm.setAttribute("y2", np.rightArmY2 - 35);
        window.rightPaw.setAttribute("cx", np.rightPawCx - 25);
        window.rightPaw.setAttribute("cy", np.rightPawCy - 35);
        
        // Голова немного наклоняется к лапе
        window.head.setAttribute("transform", "rotate(-5, 145, 210)");
        
        // Создаём ЯЗЫК
        const tongue = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        tongue.setAttribute("id", "lick-tongue");
        tongue.setAttribute("cx", "155");
        tongue.setAttribute("cy", "238");
        tongue.setAttribute("rx", "6");
        tongue.setAttribute("ry", "10");
        tongue.setAttribute("fill", "#ff8888");
        tongue.setAttribute("stroke", "#222");
        tongue.setAttribute("stroke-width", "1.5");
        window.catGroup.appendChild(tongue);
        
        // Анимация лизания (язык двигается)
        let lickCount = 0;
        const maxLicks = 6;
        
        const lickInterval = setInterval(() => {
            if (lickCount < maxLicks) {
                if (lickCount % 2 === 0) {
                    // Язык вытягивается к лапе
                    tongue.setAttribute("cy", "232");
                    tongue.setAttribute("ry", "14");
                    tongue.setAttribute("cx", "158");
                } else {
                    // Язык возвращается
                    tongue.setAttribute("cy", "238");
                    tongue.setAttribute("ry", "10");
                    tongue.setAttribute("cx", "155");
                }
                lickCount++;
            } else {
                clearInterval(lickInterval);
                
                // Убираем язык
                tongue.remove();
                
                // Возвращаем лапу и голову
                window.rightArm.setAttribute("x2", np.rightArmX2);
                window.rightArm.setAttribute("y2", np.rightArmY2);
                window.rightPaw.setAttribute("cx", np.rightPawCx);
                window.rightPaw.setAttribute("cy", np.rightPawCy);
                
                window.head.setAttribute("transform", "");
                
                setTimeout(() => {
                    isAnimating = false;
                    resolve();
                }, 200);
            }
        }, 250);
    });
}*/

/*function lickPawAnimation() {
    return new Promise((resolve) => {
        isAnimating = true;
        
        // Поднимаем ПРАВУЮ лапу ВЫШЕ и ПРАВЕЕ
        window.rightArm.setAttribute("x2", String(np.rightArmX2 + 5));
        window.rightArm.setAttribute("y2", String(np.rightArmY2 - 40));
        window.rightPaw.setAttribute("cx", String(np.rightPawCx + 5));
        window.rightPaw.setAttribute("cy", String(np.rightPawCy - 40));
        
        // Голова наклоняется к лапе
        window.head.setAttribute("transform", "rotate(-6, 150, 265)");
        
        // ЯЗЫК - от рта (146, 297) вниз и вправо к лапе
        const tongue = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        tongue.setAttribute("id", "lick-tongue");
        tongue.setAttribute("cx", "160");
        tongue.setAttribute("cy", "310");
        tongue.setAttribute("rx", "7");
        tongue.setAttribute("ry", "14");
        tongue.setAttribute("fill", "#ff8888");
        tongue.setAttribute("stroke", "#222");
        tongue.setAttribute("stroke-width", "1.5");
        window.catGroup.appendChild(tongue);
        
        let lickCount = 0;
        const maxLicks = 6;
        
        const lickInterval = setInterval(() => {
            if (lickCount < maxLicks) {
                if (lickCount % 2 === 0) {
                    // Язык вытягивается вправо-вверх к лапе
                    tongue.setAttribute("cx", "168");
                    tongue.setAttribute("cy", "300");
                    tongue.setAttribute("ry", "18");
                } else {
                    // Язык возвращается
                    tongue.setAttribute("cx", "160");
                    tongue.setAttribute("cy", "310");
                    tongue.setAttribute("ry", "14");
                }
                lickCount++;
            } else {
                clearInterval(lickInterval);
                tongue.remove();
                
                window.rightArm.setAttribute("x2", np.rightArmX2);
                window.rightArm.setAttribute("y2", np.rightArmY2);
                window.rightPaw.setAttribute("cx", np.rightPawCx);
                window.rightPaw.setAttribute("cy", np.rightPawCy);
                window.head.setAttribute("transform", "");
                
                setTimeout(() => {
                    isAnimating = false;
                    resolve();
                }, 200);
            }
        }, 450);
    });
}*/

function lickPawAnimation() {
    return new Promise((resolve) => {
        isAnimating = true;
        
        // Поднимаем ПРАВУЮ лапу ВЫШЕ и ПРАВЕЕ
        window.rightArm.setAttribute("x2", String(np.rightArmX2 - 10));
        window.rightArm.setAttribute("y2", String(np.rightArmY2 - 40));
        window.rightPaw.setAttribute("cx", String(np.rightPawCx - 10));
        window.rightPaw.setAttribute("cy", String(np.rightPawCy - 40));
        
        // Голова наклоняется к лапе
        window.head.setAttribute("transform", "rotate(-6, 150, 265)");
        
        // Координаты рта (верхняя точка языка всегда здесь)
        const mouthY = 297;
        const mouthX = 150;
        
        // ЯЗЫК - начальное состояние (спрятан во рту)
        const tongue = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        tongue.setAttribute("id", "lick-tongue");
        tongue.setAttribute("cx", String(mouthX));
        tongue.setAttribute("cy", String(mouthY)); // центр в точке рта
        tongue.setAttribute("rx", "7");
        tongue.setAttribute("ry", "0");
        tongue.setAttribute("fill", "#ff8888");
        tongue.setAttribute("stroke", "#222");
        tongue.setAttribute("stroke-width", "1.5");
        window.catGroup.appendChild(tongue);
        
        let lickCount = 0;
        const maxLicks = 6;
        const maxTongueLength = 25; // максимальная длина языка
        
        const animateTongue = (targetLength, duration) => {
            return new Promise(resolve => {
                const startLength = parseFloat(tongue.getAttribute("ry"));
                const startTime = Date.now();
                
                const animation = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(1, elapsed / duration);
                    
                    // Текущая длина
                    const currentLength = startLength + (targetLength - startLength) * progress;
                    
                    // ВАЖНО: центр смещается вниз на величину радиуса
                    // Тогда верхняя точка = cy - ry = (mouthY + ry) - ry = mouthY (всегда у рта!)
                    tongue.setAttribute("cy", String(mouthY + currentLength));
                    tongue.setAttribute("ry", String(currentLength));
                    
                    if (progress >= 1) {
                        clearInterval(animation);
                        resolve();
                    }
                }, 16);
            });
        };
        
        async function lickCycle() {
            for (let i = 0; i < maxLicks; i++) {
                // Язык высовывается
                await animateTongue(maxTongueLength, 350);
                // Язык прячется
                await animateTongue(0, 350);
            }
            tongue.remove();
            
            // Возвращаем лапу и голову
            window.rightArm.setAttribute("x2", np.rightArmX2);
            window.rightArm.setAttribute("y2", np.rightArmY2);
            window.rightPaw.setAttribute("cx", np.rightPawCx);
            window.rightPaw.setAttribute("cy", np.rightPawCy);
            window.head.setAttribute("transform", "");
            
            setTimeout(() => {
                isAnimating = false;
                resolve();
            }, 200);
        }
        
        lickCycle();
    });
}

// ========== АНИМАЦИЯ: МУХА (ТОЧНО ЛОВИТ) ==========
function flyAnimation() {
    return new Promise((resolve) => {
        isAnimating = true;
        flyActive = true;
        
        const catRect = window.catContainer.getBoundingClientRect();
        
        // Муха появляется справа от кота
        flyX = catRect.right + 70;
        flyY = catRect.top + catRect.height / 2 - 30;
        flyElement.style.left = flyX + 'px';
        flyElement.style.top = flyY + 'px';
        flyElement.style.display = 'block';
        
        // МЕДЛЕННЕЕ, чтобы кот успел среагировать
        let flySpeedX = -1.2;
        let flySpeedY = (Math.random() - 0.5) * 1.0;
        let startTime = Date.now();
        let canHit = true;
        let hitCount = 0;
        
        // Функция слежения за мухой
        function trackFly() {
            const catRect2 = window.catContainer.getBoundingClientRect();
            const catCenterX = catRect2.left + catRect2.width / 2;
            const catCenterY = catRect2.top + catRect2.height / 2;
            
            let dx = (flyX - catCenterX) / 15;
            let dy = (flyY - catCenterY) / 15;
            
            const maxOffset = np.leftEyeRx - np.leftPupilR - 2;
            dx = Math.max(-maxOffset, Math.min(maxOffset, dx));
            dy = Math.max(-maxOffset, Math.min(maxOffset, dy));
            
            window.leftPupil.setAttribute("cx", np.leftPupilCx + dx);
            window.leftPupil.setAttribute("cy", np.leftPupilCy + dy);
            window.rightPupil.setAttribute("cx", np.rightPupilCx + dx);
            window.rightPupil.setAttribute("cy", np.rightPupilCy + dy);
            
            window.leftHighlight.setAttribute("cx", np.leftHighCx + dx * 0.7);
            window.leftHighlight.setAttribute("cy", np.leftHighCy + dy * 0.7);
            window.rightHighlight.setAttribute("cx", np.rightHighCx + dx * 0.7);
            window.rightHighlight.setAttribute("cy", np.rightHighCy + dy * 0.7);
            
            const earTilt = dx * 1.2;
            const limitedEarTilt = Math.max(-15, Math.min(15, earTilt));
            
            window.leftEar.setAttribute("transform", `rotate(${limitedEarTilt}, 102, 170)`);
            window.leftEarInner.setAttribute("transform", `rotate(${limitedEarTilt}, 104, 167)`);
            window.rightEar.setAttribute("transform", `rotate(${limitedEarTilt}, 178, 168)`);
            window.rightEarInner.setAttribute("transform", `rotate(${limitedEarTilt}, 176, 165)`);
        }
        
        flyInterval = setInterval(() => {
            if (!flyActive) return;
            
            // Таймаут 6 секунд
            if (Date.now() - startTime > 6000) {
                flyActive = false;
                flyElement.style.display = 'none';
                clearInterval(flyInterval);
                resetPupilsAndEars();
                isAnimating = false;
                resolve();
                return;
            }
            
            // Движение мухи
            flyX += flySpeedX;
            flyY += flySpeedY;
            
            // Отскок от краёв
            if (flyX < 20) flySpeedX = Math.abs(flySpeedX);
            if (flyX > window.innerWidth - 20) flySpeedX = -Math.abs(flySpeedX);
            if (flyY < 20) flySpeedY = Math.abs(flySpeedY);
            if (flyY > window.innerHeight - 20) flySpeedY = -Math.abs(flySpeedY);
            
            flyElement.style.left = flyX + 'px';
            flyElement.style.top = flyY + 'px';
            
            // Кот следит
            trackFly();
            
            // ПРОВЕРКА УДАРА
            if (canHit) {
                const catRect2 = window.catContainer.getBoundingClientRect();
                
                // Вычисляем ЭКРАННЫЕ координаты лап
                // Левая лапа: x1=118, y1=308, x2=112, y2=335
                const leftPawScreenX = catRect2.left + 112;
                const leftPawScreenY = catRect2.top + 335;
                
                // Правая лапа: x1=168, y1=308, x2=174, y2=335
                const rightPawScreenX = catRect2.left + 174;
                const rightPawScreenY = catRect2.top + 335;
                
                // Расстояние до лап
                const distToLeft = Math.sqrt(Math.pow(flyX - leftPawScreenX, 2) + Math.pow(flyY - leftPawScreenY, 2));
                const distToRight = Math.sqrt(Math.pow(flyX - rightPawScreenX, 2) + Math.pow(flyY - rightPawScreenY, 2));
                
                // УВЕЛИЧЕННЫЙ РАДИУС ДО 100 ПИКСЕЛЕЙ
                if (distToLeft < 100 || distToRight < 100) {
                    canHit = false;
                    hitCount++;
                    
                    console.log('💥 УДАР! Муха на расстоянии:', Math.min(distToLeft, distToRight));
                    
                    const useLeftPaw = distToLeft < distToRight;
                    
                    if (useLeftPaw) {
                        // Удар левой лапой
                        const hitX = flyX - catRect2.left + 15;
                        const hitY = flyY - catRect2.top - 10;
                        
                        window.leftArm.setAttribute("x2", hitX);
                        window.leftArm.setAttribute("y2", hitY);
                        window.leftPaw.setAttribute("cx", hitX);
                        window.leftPaw.setAttribute("cy", hitY);
                        
                        setTimeout(() => {
                            window.leftArm.setAttribute("x2", np.leftArmX2);
                            window.leftArm.setAttribute("y2", np.leftArmY2);
                            window.leftPaw.setAttribute("cx", np.leftPawCx);
                            window.leftPaw.setAttribute("cy", np.leftPawCy);
                        }, 200);
                    } else {
                        // Удар правой лапой
                        const hitX = flyX - catRect2.left - 15;
                        const hitY = flyY - catRect2.top - 10;
                        
                        window.rightArm.setAttribute("x2", hitX);
                        window.rightArm.setAttribute("y2", hitY);
                        window.rightPaw.setAttribute("cx", hitX);
                        window.rightPaw.setAttribute("cy", hitY);
                        
                        setTimeout(() => {
                            window.rightArm.setAttribute("x2", np.rightArmX2);
                            window.rightArm.setAttribute("y2", np.rightArmY2);
                            window.rightPaw.setAttribute("cx", np.rightPawCx);
                            window.rightPaw.setAttribute("cy", np.rightPawCy);
                        }, 200);
                    }
                    
                    // МУХА ИСЧЕЗАЕТ
                    setTimeout(() => {
                        flyActive = false;
                        flyElement.style.display = 'none';
                        clearInterval(flyInterval);
                        resetPupilsAndEars();
                        isAnimating = false;
                        resolve();
                    }, 100);
                }
            }
        }, 40); // Частота обновления
    });
}

        function walkAnimation() {
            return new Promise((resolve) => {
                isAnimating = true;
                
                const startLeft = window.catContainer.offsetLeft;
                let step = 0;
                
                const walkInterval = setInterval(() => {
                    if (step < 6) {
                        if (step < 3) {
                            window.catContainer.style.left = (startLeft - step * 10) + 'px';
                        } else {
                            window.catContainer.style.left = (startLeft - 30 + (step - 3) * 10) + 'px';
                        }
                        
                        if (step % 2 === 0) {
                            window.leftArm.setAttribute("x2", String(parseInt(window.leftArm.getAttribute("x2")) - 4));
                            window.rightArm.setAttribute("x2", String(parseInt(window.rightArm.getAttribute("x2")) + 4));
                        } else {
                            window.leftArm.setAttribute("x2", np.leftArmX2);
                            window.rightArm.setAttribute("x2", np.rightArmX2);
                        }
                        
                        step++;
                    } else {
                        clearInterval(walkInterval);
                        window.catContainer.style.left = startLeft + 'px';
                        window.leftArm.setAttribute("x2", np.leftArmX2);
                        window.rightArm.setAttribute("x2", np.rightArmX2);
                        isAnimating = false;
                        resolve();
                    }
                }, 180);
            });
        }
        
/*function poopAnimation() {
    return new Promise((resolve) => {
        isAnimating = true;
        
        // КОТ ОСТАЁТСЯ НЕПОДВИЖНЫМ
        
        // Какашка появляется из-под хвоста (справа)
        window.poopGroup.style.display = "block";
        window.poopBottom.setAttribute("cx", "195");
        window.poopTop.setAttribute("cx", "195");
        window.poopBottom.setAttribute("cy", "300");
        window.poopTop.setAttribute("cy", "290");
        
        let poopY = 300;
        let phase = 0; // 0 - падение, 1 - закапывание
        let buryCount = 0;
        let activePaw = 'left'; // 'left' или 'right'
        let swingOffset = 0;
        let swingDirection = 1; // 1 - вправо, -1 - влево
        let returningToCenter = false;
        
        const poopInterval = setInterval(() => {
            if (phase === 0) {
                // ПАДЕНИЕ КАКАШКИ
                poopY += 2;
                window.poopBottom.setAttribute("cy", poopY);
                window.poopTop.setAttribute("cy", poopY - 10);
                
                if (poopY >= 340) {
                    phase = 1;
                }
            } else if (phase === 1) {
                // ЗАКАПЫВАНИЕ - ЛАПЫ ПО ОЧЕРЕДИ
                
                if (!returningToCenter) {
                    // Движение лапы в сторону
                    swingOffset += swingDirection * 10;
                    
                    if (swingOffset >= 25) {
                        // Достигли крайнего положения, начинаем возврат
                        returningToCenter = true;
                        swingDirection = -1;
                    }
                } else {
                    // Возврат лапы в центр
                    swingOffset += swingDirection * 10;
                    
                    if (swingOffset <= 0) {
                        // Вернулись в центр
                        swingOffset = 0;
                        returningToCenter = false;
                        swingDirection = 1;
                        
                        // Меняем активную лапу
                        activePaw = activePaw === 'left' ? 'right' : 'left';
                        buryCount++;
                    }
                }
                
                // Применяем смещение к активной лапе
                if (activePaw === 'left') {
                    // Левая лапа двигается, правая на месте
                    const leftBaseX = np.leftArmX1;
                    const leftBaseY = np.leftArmY1;
                    
                    if (!returningToCenter) {
                        // Движение вправо-вниз
                        window.leftArm.setAttribute("x2", leftBaseX + swingOffset);
                        window.leftArm.setAttribute("y2", leftBaseY + 25 + swingOffset * 0.5);
                        window.leftPaw.setAttribute("cx", leftBaseX + swingOffset);
                        window.leftPaw.setAttribute("cy", leftBaseY + 25 + swingOffset * 0.5);
                    } else {
                        // Возврат
                        window.leftArm.setAttribute("x2", leftBaseX + swingOffset);
                        window.leftArm.setAttribute("y2", leftBaseY + 25 + swingOffset * 0.5);
                        window.leftPaw.setAttribute("cx", leftBaseX + swingOffset);
                        window.leftPaw.setAttribute("cy", leftBaseY + 25 + swingOffset * 0.5);
                    }
                    
                    // Правая лапа остаётся на месте
                    window.rightArm.setAttribute("x2", np.rightArmX2);
                    window.rightArm.setAttribute("y2", np.rightArmY2);
                    window.rightPaw.setAttribute("cx", np.rightPawCx);
                    window.rightPaw.setAttribute("cy", np.rightPawCy);
                    
                } else {
                    // Правая лапа двигается, левая на месте
                    const rightBaseX = np.rightArmX1;
                    const rightBaseY = np.rightArmY1;
                    
                    if (!returningToCenter) {
                        // Движение влево-вниз
                        window.rightArm.setAttribute("x2", rightBaseX - swingOffset);
                        window.rightArm.setAttribute("y2", rightBaseY + 25 + swingOffset * 0.5);
                        window.rightPaw.setAttribute("cx", rightBaseX - swingOffset);
                        window.rightPaw.setAttribute("cy", rightBaseY + 25 + swingOffset * 0.5);
                    } else {
                        // Возврат
                        window.rightArm.setAttribute("x2", rightBaseX - swingOffset);
                        window.rightArm.setAttribute("y2", rightBaseY + 25 + swingOffset * 0.5);
                        window.rightPaw.setAttribute("cx", rightBaseX - swingOffset);
                        window.rightPaw.setAttribute("cy", rightBaseY + 25 + swingOffset * 0.5);
                    }
                    
                    // Левая лапа остаётся на месте
                    window.leftArm.setAttribute("x2", np.leftArmX2);
                    window.leftArm.setAttribute("y2", np.leftArmY2);
                    window.leftPaw.setAttribute("cx", np.leftPawCx);
                    window.leftPaw.setAttribute("cy", np.leftPawCy);
                }
                
                // Закапывание длится 6 циклов (по 3 на каждую лапу)
                if (buryCount >= 6) {
                    clearInterval(poopInterval);
                    window.poopGroup.style.display = "none";
                    
                    // Возврат обеих лап в исходное положение
                    window.leftArm.setAttribute("x2", np.leftArmX2);
                    window.leftArm.setAttribute("y2", np.leftArmY2);
                    window.leftPaw.setAttribute("cx", np.leftPawCx);
                    window.leftPaw.setAttribute("cy", np.leftPawCy);
                    
                    window.rightArm.setAttribute("x2", np.rightArmX2);
                    window.rightArm.setAttribute("y2", np.rightArmY2);
                    window.rightPaw.setAttribute("cx", np.rightPawCx);
                    window.rightPaw.setAttribute("cy", np.rightPawCy);
                    
                    // Возврат позиции какашки
                    window.poopBottom.setAttribute("cx", "178");
                    window.poopTop.setAttribute("cx", "178");
                    
                    isAnimating = false;
                    resolve();
                }
            }
        }, 80);
    });
} */

function poopAnimation() {
    return new Promise((resolve) => {
        isAnimating = true;
        
        // Какашка появляется справа-снизу от кота (под хвостом)
        window.poopGroup.style.display = "block";
        window.poopBottom.setAttribute("cx", "220");
        window.poopTop.setAttribute("cx", "220");
        window.poopBottom.setAttribute("cy", "365");
        window.poopTop.setAttribute("cy", "355");
        
        let poopY = 365;
        let phase = 0;
        let buryCount = 0;
        let activePaw = 'left';
        let swingOffset = 0;
        let swingDirection = 1;
        let returningToCenter = false;
        
        const poopInterval = setInterval(() => {
            if (phase === 0) {
                poopY += 2;
                window.poopBottom.setAttribute("cy", poopY);
                window.poopTop.setAttribute("cy", poopY - 10);
                
                if (poopY >= 390) {
                    phase = 1;
                }
            } else if (phase === 1) {
                if (!returningToCenter) {
                    swingOffset += swingDirection * 10;
                    if (swingOffset >= 25) {
                        returningToCenter = true;
                        swingDirection = -1;
                    }
                } else {
                    swingOffset += swingDirection * 10;
                    if (swingOffset <= 0) {
                        swingOffset = 0;
                        returningToCenter = false;
                        swingDirection = 1;
                        activePaw = activePaw === 'left' ? 'right' : 'left';
                        buryCount++;
                    }
                }
                
                if (activePaw === 'left') {
                    const leftBaseX = np.leftArmX1;
                    const leftBaseY = np.leftArmY1;
                    window.leftArm.setAttribute("x2", leftBaseX + swingOffset);
                    window.leftArm.setAttribute("y2", leftBaseY + 25 + swingOffset * 0.5);
                    window.leftPaw.setAttribute("cx", leftBaseX + swingOffset);
                    window.leftPaw.setAttribute("cy", leftBaseY + 25 + swingOffset * 0.5);
                    
                    window.rightArm.setAttribute("x2", np.rightArmX2);
                    window.rightArm.setAttribute("y2", np.rightArmY2);
                    window.rightPaw.setAttribute("cx", np.rightPawCx);
                    window.rightPaw.setAttribute("cy", np.rightPawCy);
                } else {
                    const rightBaseX = np.rightArmX1;
                    const rightBaseY = np.rightArmY1;
                    window.rightArm.setAttribute("x2", rightBaseX - swingOffset);
                    window.rightArm.setAttribute("y2", rightBaseY + 25 + swingOffset * 0.5);
                    window.rightPaw.setAttribute("cx", rightBaseX - swingOffset);
                    window.rightPaw.setAttribute("cy", rightBaseY + 25 + swingOffset * 0.5);
                    
                    window.leftArm.setAttribute("x2", np.leftArmX2);
                    window.leftArm.setAttribute("y2", np.leftArmY2);
                    window.leftPaw.setAttribute("cx", np.leftPawCx);
                    window.leftPaw.setAttribute("cy", np.leftPawCy);
                }
                
                if (buryCount >= 6) {
                    clearInterval(poopInterval);
                    window.poopGroup.style.display = "none";
                    
                    window.leftArm.setAttribute("x2", np.leftArmX2);
                    window.leftArm.setAttribute("y2", np.leftArmY2);
                    window.leftPaw.setAttribute("cx", np.leftPawCx);
                    window.leftPaw.setAttribute("cy", np.leftPawCy);
                    
                    window.rightArm.setAttribute("x2", np.rightArmX2);
                    window.rightArm.setAttribute("y2", np.rightArmY2);
                    window.rightPaw.setAttribute("cx", np.rightPawCx);
                    window.rightPaw.setAttribute("cy", np.rightPawCy);
                    
                    window.poopBottom.setAttribute("cx", "285");
                    window.poopTop.setAttribute("cx", "285");
                    
                    isAnimating = false;
                    resolve();
                }
            }
        }, 80);
    });
}

       
function yawnAnimation() {
    return new Promise((resolve) => {
        isAnimating = true;
        isYawning = true; 
        
        // Сохраняем оригинальные параметры
        const originalHeadRy = np.headRy;
        const originalMouthD = np.mouthD;
        
        // Голова немного расширяется при зевании
        window.head.setAttribute("ry", String(np.headRy + 10));
        
        // Смещаем глаза, зрачки и нос вверх
        const shiftUp = -18;
        window.leftEye.setAttribute("cy", String(np.leftEyeCy + shiftUp));
        window.rightEye.setAttribute("cy", String(np.rightEyeCy + shiftUp));
        window.leftPupil.setAttribute("cy", String(np.leftPupilCy + shiftUp));
        window.rightPupil.setAttribute("cy", String(np.rightPupilCy + shiftUp));
        window.leftHighlight.setAttribute("cy", String(np.leftHighCy + shiftUp));
        window.rightHighlight.setAttribute("cy", String(np.rightHighCy + shiftUp));
        
        // Нос тоже поднимается
        window.nose.setAttribute("points", `143,${283 + shiftUp} 150,${283 + shiftUp} 146,${288 + shiftUp}`);
        
        // Усы поднимаются
        window.whiskers.setAttribute("d", `M 105,${275 + shiftUp} L 60,${270 + shiftUp} M 105,${283 + shiftUp} L 60,${285 + shiftUp} M 181,${273 + shiftUp} L 225,${267 + shiftUp} M 181,${281 + shiftUp} L 225,${283 + shiftUp}`);
        
        // Убираем обычный рот
        window.mouth.style.display = "none";
        
        // Рисуем зевающий рот - ОПУЩЕН и ПРАВЕЕ
        // Центр рта теперь: x = 155 (правее на 5), y = 315 (ниже на 18)
        const yawnMouth = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        yawnMouth.setAttribute("id", "yawn-mouth");
        yawnMouth.setAttribute("cx", "155");
        yawnMouth.setAttribute("cy", "300");
        yawnMouth.setAttribute("rx", "24");
        yawnMouth.setAttribute("ry", "20");
        yawnMouth.setAttribute("fill", "#1a1a1a");
        yawnMouth.setAttribute("stroke", "#222");
        yawnMouth.setAttribute("stroke-width", "3");
        window.catGroup.appendChild(yawnMouth);
        
        // Язык внутри рта
        const yawnTongue = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        yawnTongue.setAttribute("id", "yawn-tongue");
        yawnTongue.setAttribute("cx", "155");
        yawnTongue.setAttribute("cy", "308");
        yawnTongue.setAttribute("rx", "10");
        yawnTongue.setAttribute("ry", "6");
        yawnTongue.setAttribute("fill", "#ff8888");
        window.catGroup.appendChild(yawnTongue);
        
/*        setTimeout(() => {
            // Возвращаем голову
            window.head.setAttribute("ry", String(originalHeadRy));
            
            // Возвращаем глаза
            window.leftEye.setAttribute("cy", String(np.leftEyeCy));
            window.rightEye.setAttribute("cy", String(np.rightEyeCy));
            window.leftPupil.setAttribute("cy", String(np.leftPupilCy));
            window.rightPupil.setAttribute("cy", String(np.rightPupilCy));
            window.leftHighlight.setAttribute("cy", String(np.leftHighCy));
            window.rightHighlight.setAttribute("cy", String(np.rightHighCy));
            
            // Возвращаем нос
            window.nose.setAttribute("points", np.nosePoints);
            
            // Возвращаем усы
            window.whiskers.setAttribute("d", np.whiskersD);
            
            // Удаляем зевающий рот и язык
            yawnMouth.remove();
            yawnTongue.remove();
            
            // Показываем обычный рот
            window.mouth.style.display = "";
            window.mouth.setAttribute("d", originalMouthD);
            
            isAnimating = false;
            resolve();
        }, 3000); // Зевает 3 секунды
    });
}*/

        setTimeout(() => {
            // Возвращаем голову
            window.head.setAttribute("ry", String(originalHeadRy));
            
            // Возвращаем глаза
            window.leftEye.setAttribute("cy", String(np.leftEyeCy));
            window.rightEye.setAttribute("cy", String(np.rightEyeCy));
            window.leftPupil.setAttribute("cy", String(np.leftPupilCy));
            window.rightPupil.setAttribute("cy", String(np.rightPupilCy));
            window.leftHighlight.setAttribute("cy", String(np.leftHighCy));
            window.rightHighlight.setAttribute("cy", String(np.rightHighCy));
            
            // Возвращаем нос
            window.nose.setAttribute("points", np.nosePoints);
            
            // Возвращаем усы
            window.whiskers.setAttribute("d", np.whiskersD);
            
            // Удаляем зевающий рот и язык
            yawnMouth.remove();
            yawnTongue.remove();
            
            // Показываем обычный рот
            window.mouth.style.display = "";
            window.mouth.setAttribute("d", originalMouthD);
            
            isYawning = false; // ← ВЫКЛЮЧАЕМ ФЛАГ ЗЕВОТЫ
            isAnimating = false;
            resolve();
        }, 3000);
    });
}
        
        // ========== РАНДОМНЫЙ ЦИКЛ ==========
        const animations = [flyAnimation, walkAnimation, poopAnimation, yawnAnimation,stretchUpAnimation,pawsOnMonitorAnimation, walkAwayAnimation,  lickPawAnimation ];
        
        /*async function randomAnimationCycle() {
            while (true) {
                await new Promise(r => setTimeout(r, 5000));// анимация каждые 7 сек
                
                if (!isDragging && !isAnimating && !flyActive) {
                    const randomAnim = animations[Math.floor(Math.random() * animations.length)];
                    //const randomAnim = animations[3];
                    await randomAnim();
                    resetPupilsAndEars();
                }
            }
        }*/
        async function randomAnimationCycle() {
    while (true) {
        await new Promise(r => setTimeout(r, 25000)); // анимация каждые 8 сек
        
        if (!isDragging && !isAnimating && !flyActive) {
            let randomIndex;
            
            // Выбираем случайный индекс, не равный предыдущему
            // (только если анимаций больше одной)
            if (animations.length > 1) {
                do {
                    randomIndex = Math.floor(Math.random() * animations.length);
                } while (randomIndex === lastAnimationIndex);
            } else {
                randomIndex = 0;
            }
            
            lastAnimationIndex = randomIndex;
            const randomAnim = animations[randomIndex];
            
            await randomAnim();
            resetPupilsAndEars();
        }
    }
}
        
        randomAnimationCycle();
        
        console.log('✅ Кот готов!');
    }
})();
