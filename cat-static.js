// ========== КОТ (ИСПРАВЛЕНО - ЦЕНТРИРОВАН) ==========
(function() {
    if (window.catStaticLoaded) return;
    window.catStaticLoaded = true;

    const svgNS = "http://www.w3.org/2000/svg";
    
    window.catContainer = document.createElement('div');
    window.catContainer.className = 'cat-addon';
    window.catContainer.style.bottom = '20px';
    window.catContainer.style.right = '20px';
    window.catContainer.style.top = 'auto';
    window.catContainer.style.left = 'auto';
    
    window.svg = document.createElementNS(svgNS, "svg");
    window.svg.setAttribute("viewBox", "0 0 300 420");
    window.svg.setAttribute("class", "cat-svg");
    
    window.catGroup = document.createElementNS(svgNS, "g");
    window.catGroup.setAttribute("id", "cat-group");
    
    // ---- ТЕНЬ (центрирована) ----
    window.shadow = document.createElementNS(svgNS, "ellipse");
    window.shadow.setAttribute("cx", "150");
    window.shadow.setAttribute("cy", "380");
    window.shadow.setAttribute("rx", "85");
    window.shadow.setAttribute("ry", "6");
    window.shadow.setAttribute("fill", "rgba(0,0,0,0.15)");
    window.shadow.setAttribute("stroke", "none");
    window.catGroup.appendChild(window.shadow);
    
    // ---- ХВОСТ (опущен на 3 часа) ----
    window.tail = document.createElementNS(svgNS, "path");
    window.tail.setAttribute("d", "M 140,340 Q 190,350 220,340 Q 240,330 230,320");
    window.tail.setAttribute("fill", "none");
    window.tail.setAttribute("stroke", "#222");
    window.tail.setAttribute("stroke-width", "5");
    window.tail.setAttribute("stroke-linecap", "round");
    window.catGroup.appendChild(window.tail);
    
    // ---- ЗАДНИЕ ЛАПЫ ----
    window.backLegLeft = document.createElementNS(svgNS, "ellipse");
    window.backLegLeft.setAttribute("cx", "130");
    window.backLegLeft.setAttribute("cy", "370");
    window.backLegLeft.setAttribute("rx", "15");
    window.backLegLeft.setAttribute("ry", "6");
    window.backLegLeft.setAttribute("fill", "#FFFFFF");
    window.backLegLeft.setAttribute("stroke", "#222");
    window.backLegLeft.setAttribute("stroke-width", "4");
    window.catGroup.appendChild(window.backLegLeft);
    
    window.backLegRight = document.createElementNS(svgNS, "ellipse");
    window.backLegRight.setAttribute("cx", "170");
    window.backLegRight.setAttribute("cy", "370");
    window.backLegRight.setAttribute("rx", "15");
    window.backLegRight.setAttribute("ry", "6");
    window.backLegRight.setAttribute("fill", "#FFFFFF");
    window.backLegRight.setAttribute("stroke", "#222");
    window.backLegRight.setAttribute("stroke-width", "4");
    window.catGroup.appendChild(window.backLegRight);
    
    // ---- ТЕЛО ----
    window.body = document.createElementNS(svgNS, "ellipse");
    window.body.setAttribute("cx", "150");
    window.body.setAttribute("cy", "340");
    window.body.setAttribute("rx", "30");
    window.body.setAttribute("ry", "33");
    window.body.setAttribute("fill", "#FFFFFF");
    window.body.setAttribute("stroke", "#222");
    window.body.setAttribute("stroke-width", "3");
    window.catGroup.appendChild(window.body);
    
    // ---- ПЕРЕДНИЕ ЛАПЫ ----
    window.leftArm = document.createElementNS(svgNS, "line");
    window.leftArm.setAttribute("x1", "135");
    window.leftArm.setAttribute("y1", "360");
    window.leftArm.setAttribute("x2", "130");
    window.leftArm.setAttribute("y2", "380");
    window.leftArm.setAttribute("stroke", "#222");
    window.leftArm.setAttribute("stroke-width", "3");
    window.leftArm.setAttribute("stroke-linecap", "round");
    window.catGroup.appendChild(window.leftArm);
    
    window.rightArm = document.createElementNS(svgNS, "line");
    window.rightArm.setAttribute("x1", "165");
    window.rightArm.setAttribute("y1", "360");
    window.rightArm.setAttribute("x2", "170");
    window.rightArm.setAttribute("y2", "380");
    window.rightArm.setAttribute("stroke", "#222");
    window.rightArm.setAttribute("stroke-width", "3");
    window.rightArm.setAttribute("stroke-linecap", "round");
    window.catGroup.appendChild(window.rightArm);
    
    window.leftPaw = document.createElementNS(svgNS, "ellipse");
    window.leftPaw.setAttribute("cx", "130");
    window.leftPaw.setAttribute("cy", "378");
    window.leftPaw.setAttribute("rx", "8");
    window.leftPaw.setAttribute("ry", "4");
    window.leftPaw.setAttribute("fill", "#FFFFFF");
    window.leftPaw.setAttribute("stroke", "#222");
    window.leftPaw.setAttribute("stroke-width", "2");
    window.catGroup.appendChild(window.leftPaw);
    
    window.rightPaw = document.createElementNS(svgNS, "ellipse");
    window.rightPaw.setAttribute("cx", "170");
    window.rightPaw.setAttribute("cy", "378");
    window.rightPaw.setAttribute("rx", "8");
    window.rightPaw.setAttribute("ry", "4");
    window.rightPaw.setAttribute("fill", "#FFFFFF");
    window.rightPaw.setAttribute("stroke", "#222");
    window.rightPaw.setAttribute("stroke-width", "2");
    window.catGroup.appendChild(window.rightPaw);
    
    // ---- ГОЛОВА ----
    window.head = document.createElementNS(svgNS, "ellipse");
    window.head.setAttribute("cx", "150");
    window.head.setAttribute("cy", "265");
    window.head.setAttribute("rx", "52");
    window.head.setAttribute("ry", "48");
    window.head.setAttribute("fill", "#FFFFFF");
    window.head.setAttribute("stroke", "#222");
    window.head.setAttribute("stroke-width", "3");
    window.catGroup.appendChild(window.head);
    
    // ---- УШИ ----
    window.leftEar = document.createElementNS(svgNS, "polygon");
    window.leftEar.setAttribute("points", "110,225 98,193 126,213");
    window.leftEar.setAttribute("fill", "#FFFFFF");
    window.leftEar.setAttribute("stroke", "#222");
    window.leftEar.setAttribute("stroke-width", "2");
    window.leftEar.setAttribute("stroke-linejoin", "round");
    window.catGroup.appendChild(window.leftEar);
    
    window.rightEar = document.createElementNS(svgNS, "polygon");
    window.rightEar.setAttribute("points", "186,223 198,191 170,211");
    window.rightEar.setAttribute("fill", "#FFFFFF");
    window.rightEar.setAttribute("stroke", "#222");
    window.rightEar.setAttribute("stroke-width", "2");
    window.rightEar.setAttribute("stroke-linejoin", "round");
    window.catGroup.appendChild(window.rightEar);
    
    window.leftEarInner = document.createElementNS(svgNS, "polygon");
    window.leftEarInner.setAttribute("points", "112,222 102,198 124,215");
    window.leftEarInner.setAttribute("fill", "#E0E0E0");
    window.leftEarInner.setAttribute("stroke", "#222");
    window.leftEarInner.setAttribute("stroke-width", "1");
    window.leftEarInner.setAttribute("stroke-linejoin", "round");
    window.catGroup.appendChild(window.leftEarInner);
    
    window.rightEarInner = document.createElementNS(svgNS, "polygon");
    window.rightEarInner.setAttribute("points", "184,220 194,196 172,213");
    window.rightEarInner.setAttribute("fill", "#E0E0E0");
    window.rightEarInner.setAttribute("stroke", "#222");
    window.rightEarInner.setAttribute("stroke-width", "1");
    window.rightEarInner.setAttribute("stroke-linejoin", "round");
    window.catGroup.appendChild(window.rightEarInner);
    
    // ---- ГЛАЗА ----
    window.leftEye = document.createElementNS(svgNS, "ellipse");
    window.leftEye.setAttribute("cx", "125");
    window.leftEye.setAttribute("cy", "260");
    window.leftEye.setAttribute("rx", "12");
    window.leftEye.setAttribute("ry", "15");
    window.leftEye.setAttribute("fill", "#FFFFFF");
    window.leftEye.setAttribute("stroke", "#222");
    window.leftEye.setAttribute("stroke-width", "3");
    window.catGroup.appendChild(window.leftEye);
    
    window.rightEye = document.createElementNS(svgNS, "ellipse");
    window.rightEye.setAttribute("cx", "173");
    window.rightEye.setAttribute("cy", "258");
    window.rightEye.setAttribute("rx", "12");
    window.rightEye.setAttribute("ry", "15");
    window.rightEye.setAttribute("fill", "#FFFFFF");
    window.rightEye.setAttribute("stroke", "#222");
    window.rightEye.setAttribute("stroke-width", "3");
    window.catGroup.appendChild(window.rightEye);
    
    // ---- ЗРАЧКИ ----
    window.leftPupil = document.createElementNS(svgNS, "circle");
    window.leftPupil.setAttribute("cx", "123");
    window.leftPupil.setAttribute("cy", "260");
    window.leftPupil.setAttribute("r", "5");
    window.leftPupil.setAttribute("fill", "#222");
    window.catGroup.appendChild(window.leftPupil);
    
    window.rightPupil = document.createElementNS(svgNS, "circle");
    window.rightPupil.setAttribute("cx", "171");
    window.rightPupil.setAttribute("cy", "258");
    window.rightPupil.setAttribute("r", "5");
    window.rightPupil.setAttribute("fill", "#222");
    window.catGroup.appendChild(window.rightPupil);
    
    window.leftHighlight = document.createElementNS(svgNS, "circle");
    window.leftHighlight.setAttribute("cx", "120");
    window.leftHighlight.setAttribute("cy", "255");
    window.leftHighlight.setAttribute("r", "2.5");
    window.leftHighlight.setAttribute("fill", "#FFFFFF");
    window.catGroup.appendChild(window.leftHighlight);
    
    window.rightHighlight = document.createElementNS(svgNS, "circle");
    window.rightHighlight.setAttribute("cx", "168");
    window.rightHighlight.setAttribute("cy", "253");
    window.rightHighlight.setAttribute("r", "2.5");
    window.rightHighlight.setAttribute("fill", "#FFFFFF");
    window.catGroup.appendChild(window.rightHighlight);
    
    // ---- НОС ----
    window.nose = document.createElementNS(svgNS, "polygon");
    window.nose.setAttribute("points", "143,283 150,283 146,288");
    window.nose.setAttribute("fill", "#FFB6C1");
    window.nose.setAttribute("stroke", "#222");
    window.nose.setAttribute("stroke-width", "1");
    window.nose.setAttribute("stroke-linejoin", "round");
    window.catGroup.appendChild(window.nose);
    
    // ---- РОТ ----
    window.mouth = document.createElementNS(svgNS, "path");
    window.mouth.setAttribute("d", "M 139,297 Q 146,303 153,297");
    window.mouth.setAttribute("fill", "none");
    window.mouth.setAttribute("stroke", "#222");
    window.mouth.setAttribute("stroke-width", "2");
    window.mouth.setAttribute("stroke-linecap", "round");
    window.catGroup.appendChild(window.mouth);
    
    // ---- УСЫ ----
    window.whiskers = document.createElementNS(svgNS, "path");
    window.whiskers.setAttribute("d", "M 105,275 L 60,270 M 105,283 L 60,285 M 181,273 L 225,267 M 181,281 L 225,283");
    window.whiskers.setAttribute("fill", "none");
    window.whiskers.setAttribute("stroke", "#222");
    window.whiskers.setAttribute("stroke-width", "2.5");
    window.whiskers.setAttribute("stroke-linecap", "round");
    window.catGroup.appendChild(window.whiskers);
    
    // ---- ПОЛОСКИ НА ЛБУ ----
    const foreheadLines = document.createElementNS(svgNS, "path");
    foreheadLines.setAttribute("d", "M 145,233 L 145,241 M 138,235 L 138,243 M 152,235 L 152,243");
    foreheadLines.setAttribute("fill", "none");
    foreheadLines.setAttribute("stroke", "#222");
    foreheadLines.setAttribute("stroke-width", "2");
    foreheadLines.setAttribute("stroke-linecap", "round");
    window.catGroup.appendChild(foreheadLines);
    
    // ---- ОБЛАЧКО РЕЧИ (динамическое) ----
    window.speechBubble = document.createElementNS(svgNS, "g");
    window.speechBubble.style.display = "none";
    
    window.bubbleRect = document.createElementNS(svgNS, "rect");
    window.bubbleRect.setAttribute("x", "30");
    window.bubbleRect.setAttribute("y", "80");
    window.bubbleRect.setAttribute("width", "240");
    window.bubbleRect.setAttribute("height", "45");
    window.bubbleRect.setAttribute("rx", "12");
    window.bubbleRect.setAttribute("fill", "white");
    window.bubbleRect.setAttribute("stroke", "#222");
    window.bubbleRect.setAttribute("stroke-width", "2");
    window.speechBubble.appendChild(window.bubbleRect);
    
    const bubbleTail = document.createElementNS(svgNS, "polygon");
    bubbleTail.setAttribute("points", "125,125 135,140 145,125");
    bubbleTail.setAttribute("fill", "white");
    bubbleTail.setAttribute("stroke", "#222");
    bubbleTail.setAttribute("stroke-width", "2");
    window.speechBubble.appendChild(bubbleTail);
    
    window.speechText = document.createElementNS(svgNS, "text");
    window.speechText.setAttribute("x", "150");
    window.speechText.setAttribute("y", "108");
    window.speechText.setAttribute("text-anchor", "middle");
    window.speechText.setAttribute("font-family", "Arial, sans-serif");
    window.speechText.setAttribute("font-size", "14");
    window.speechText.setAttribute("font-weight", "bold");
    window.speechText.setAttribute("fill", "#222");
    window.speechText.textContent = "Мяу!";
    window.speechBubble.appendChild(window.speechText);
    
    window.catGroup.appendChild(window.speechBubble);
    
    // ---- КАКАШКА ----
    window.poopGroup = document.createElementNS(svgNS, "g");
    window.poopGroup.style.display = "none";
    
    window.poopBottom = document.createElementNS(svgNS, "ellipse");
    window.poopBottom.setAttribute("cx", "185");
    window.poopBottom.setAttribute("cy", "370");
    window.poopBottom.setAttribute("rx", "10");
    window.poopBottom.setAttribute("ry", "8");
    window.poopBottom.setAttribute("fill", "#4a3728");
    window.poopBottom.setAttribute("stroke", "#222");
    window.poopBottom.setAttribute("stroke-width", "2");
    window.poopGroup.appendChild(window.poopBottom);
    
    window.poopTop = document.createElementNS(svgNS, "ellipse");
    window.poopTop.setAttribute("cx", "185");
    window.poopTop.setAttribute("cy", "360");
    window.poopTop.setAttribute("rx", "7");
    window.poopTop.setAttribute("ry", "6");
    window.poopTop.setAttribute("fill", "#4a3728");
    window.poopTop.setAttribute("stroke", "#222");
    window.poopTop.setAttribute("stroke-width", "2");
    window.poopGroup.appendChild(window.poopTop);
    
    window.catGroup.appendChild(window.poopGroup);
    
    window.svg.appendChild(window.catGroup);
    window.catContainer.appendChild(window.svg);
    document.body.appendChild(window.catContainer);
    
    // ========== СТИЛИ ==========
    const style = document.createElement('style');
    style.textContent = `
        .cat-addon {
            position: fixed;
            width: 280px;
            height: 380px;
            z-index: 999999;
            cursor: grab;
            pointer-events: auto;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
            user-select: none;
        }
        .cat-addon.dragging { cursor: grabbing; }
        .cat-svg { width: 100%; height: 100%; display: block; }
    `;
    document.head.appendChild(style);
    
    // Функция для динамического изменения облачка речи
    window.updateSpeechBubble = function(text) {
        if (!window.speechText || !window.bubbleRect) return;
        
        window.speechText.textContent = text;
        
        // Вычисляем примерную ширину текста
        const textLength = text.length;
        const bubbleWidth = Math.max(180, Math.min(260, textLength * 9));
        
        window.bubbleRect.setAttribute("width", bubbleWidth);
        window.bubbleRect.setAttribute("x", 150 - bubbleWidth/2);
        window.speechText.setAttribute("x", "150");
    };
    
    // Сохраняем координаты для анимаций
    window.normalPose = {
        // Голова
        headCx: 150, headCy: 265, headRx: 52, headRy: 48,
        // Тело
        bodyCx: 150, bodyCy: 340, bodyRx: 30, bodyRy: 33,
        shadowCy: 380,
        
        // ЗАДНИЕ ЛАПЫ
        backLegLeftCx: 130, backLegLeftCy: 370,
        backLegRightCx: 170, backLegRightCy: 370,
        
        // ПЕРЕДНИЕ ЛАПЫ
        leftArmX1: 135, leftArmY1: 360, leftArmX2: 130, leftArmY2: 380,
        rightArmX1: 165, rightArmY1: 360, rightArmX2: 170, rightArmY2: 380,
        leftPawCx: 130, leftPawCy: 378,
        rightPawCx: 170, rightPawCy: 378,
        
        // Хвост
        tailD: "M 140,340 Q 190,350 220,340 Q 240,330 230,320",
        
        // Глаза
        leftEyeCx: 125, leftEyeCy: 260, leftEyeRx: 12, leftEyeRy: 15,
        rightEyeCx: 173, rightEyeCy: 258, rightEyeRx: 12, rightEyeRy: 15,
        leftPupilCx: 123, leftPupilCy: 260, leftPupilR: 5,
        rightPupilCx: 171, rightPupilCy: 258, rightPupilR: 5,
        leftHighCx: 120, leftHighCy: 255,
        rightHighCx: 168, rightHighCy: 253,
        
        // Нос и рот
        nosePoints: "143,283 150,283 146,288",
        mouthD: "M 139,297 Q 146,303 153,297",
        whiskersD: "M 105,275 L 60,270 M 105,283 L 60,285 M 181,273 L 225,267 M 181,281 L 225,283",
        
        maxLegLength: 50
    };
    
    console.log('🐱 Кот центрирован и готов!');
})();
