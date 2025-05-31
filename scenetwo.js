// sceneTwo.js (fully integrated logic from index2.html)
//abcd
export class SceneTwo extends Phaser.Scene {
  constructor(exitGame, getMusicRef) {
    super('SceneTwo');
    this.exitGame = exitGame;
    this.getMusicRef = getMusicRef;
    this.handSprite = null;
    this.lastHandTime = 0;
    this.lastInputTime = 0;
    this.lastTappedCard = null;
    const handOffsetX = 80;
    const handOffsetY = 160;
    this.planeGlow = null;
    this.handFramesAvailable = false;
    this.cardsInitialized = false;
    this.lastHandLogState = null;
    this.completedCards = [];
    this.colorSelectionActive = false;
    this.lastColorInputTime = 0;
    this.colorSelectionStartTime = 0;
    const tapFlow = ['A', '2', '3', '8', '9', '10', 'j', 'q'];
    this.currentTapIndex = 0;
    this.cardA = null;
    this.cardABack = null;
    this.card2 = null;
    this.card2Back = null;
    this.card3 = null;
    this.card3Back = null;
    this.card8 = null;
    this.card8Back = null;
    this.card9 = null;
    this.card9Back = null;
    this.card10 = null;
    this.card10Back = null;
    this.cardJ = null;
    this.cardJBack = null;
    this.cardQ = null;
    this.cardQBack = null;
    this.cardK = null;

    this.selectColorGreen = null;
    this.selectColorPurple = null;
    this.selectColorRed = null;
    this.ctaOK = null;
    this.messageBox = null;
    this.maxDepth = 10;
    this.congrats = null;
    this.star = null;
    this.starGlow = null;
    this.selectColorUI = null;
    this.fade = null;
    this.talonBase = null;
  }

  preload() {
    console.log('Starting asset preload');
    this.load.image('card-back', 'assets/card-back.png');
    this.load.image('card-A', 'assets/card-A.png');
    this.load.image('card-2', 'assets/card-2.png');
    this.load.image('card-3', 'assets/card-3.png');
    this.load.image('card-9', 'assets/card-9.png');
    this.load.image('card-10', 'assets/card-10.png');
    this.load.image('card-j', 'assets/card-j.png');
    this.load.image('card-Q', 'assets/card-Q.png');
    this.load.image('card-8', 'assets/card-8.png');
    this.load.image('card-k', 'assets/card-k.png');
    this.load.image('Plane-Broken', 'assets/Plane-Broken.png');
    this.load.image('Plane-Green', 'assets/Plane-Green.png');
    this.load.image('Plane-Purple', 'assets/Plane-Purple.png');
    this.load.image('Plane-Red', 'assets/Plane-Red.png');
    this.load.image('Select-color-UI', 'assets/Select-color-UI.png');
    this.load.image('Select-color-Green', 'assets/Select-color-Green.png');
    this.load.image('Select-color-Purple', 'assets/Select-color-Purple.png');
    this.load.image('Select-color-Red', 'assets/Select-color-Red.png');
    this.load.image('Plane-Selected-Glow', 'assets/Plane-Selected-Glow.png');
    this.load.image('talonBase', 'assets/talon-base.png');
    this.load.image('Repaire-Plane_BG', 'assets/Repaire-Plane_BG.jpg');
    this.load.image('message', 'assets/message-box.png');
    this.load.image('fade', 'assets/fade.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.image('cta', 'assets/CTA.png');
    this.load.image('CTA-OK', 'assets/CTA-OK.png');
    this.load.image('Congrats', 'assets/Congrats.png');
    this.load.image('Star', 'assets/Star.png');
    this.load.image('Star-Glow', 'assets/Star-Glow.png');
    this.load.audio('Game_music', 'assets/Game_music.webm');
    this.load.audio('Valid2', 'assets/Valid2.mp3');
    this.load.audio('Valid3', 'assets/Valid3.mp3');
    this.load.audio('Valid4', 'assets/Valid4.mp3');
    this.load.audio('Valid-card', 'assets/Valid-card.mp3');
    this.load.audio('Button', 'assets/Button.mp3');
    this.load.audio('flip', 'assets/flip.mp3');
    this.load.audio('Invalid-Card', 'assets/Invalid-Card.mp3');
    this.load.audio('WinTrumpet', 'assets/WinTrumpet.mp3');
    for (let i = 0; i <= 10; i++) {
      const key = i.toString().padStart(3, '0');
      this.load.image(key, `assets/hand-frame/${key}.png`);
    }

  }
  preloadHandFrames(scene) {
    if (!this.handFramesAvailable) {
      console.warn('Skipping hand animation creation due to missing frames');
      return;
    }
  
    this.handFrames = [];
    for (let i = 0; i <= 10; i++) {
      const key = i.toString().padStart(3, '0');
      this.handFrames.push({ key });
    }
  
    try {
      scene.anims.create({
        key: 'handAnimOnce',
        frames: this.handFrames,
        frameRate: 10,
        repeat: 2
      });
      console.log('Hand animation created successfully');
    } catch (e) {
      console.error('Failed to create hand animation:', e);
      this.handFramesAvailable = false;
    }
  }
  

  showHandWithTween(scene, target) {
    if (!handFramesAvailable) {
      console.warn('showHandWithTween skipped: Hand frames unavailable');
      return;
    }
    if (!target || !target.scene || target.destroyed) {
      console.warn('showHandWithTween skipped: Invalid target', {
        targetExists: !!target,
        targetScene: target && !!target.scene,
        targetDestroyed: target && target.destroyed
      });
      return;
    }
    try {
      console.log(`Showing hand at target: ${target.texture.key}, x: ${target.x}, y: ${target.y}`);
      if (handSprite && handSprite.scene && !handSprite.destroyed) {
        handSprite.destroy();
        handSprite = null;
        console.log('Destroyed existing hand sprite before creating new one');
      }
      handSprite = scene.add.sprite(
        target.x + handOffsetX + 100,
        target.y + handOffsetY,
        '000'
      );
      handSprite.setDepth(3000);
      const originalY = handSprite.y;
      scene.tweens.add({
        targets: handSprite,
        x: target.x + handOffsetX,
        y: originalY - 50,
        duration: 500,
        ease: 'Quad.easeOut',
        onComplete: () => {
          if (handSprite && handSprite.scene && !handSprite.destroyed) {
            handSprite.play('handAnimOnce');
            handSprite.once(
              Phaser.Animations.Events.ANIMATION_COMPLETE,
              () => {
                if (handSprite && handSprite.scene && !handSprite.destroyed) {
                  handSprite.destroy();
                  handSprite = null;
                  lastHandTime = scene.time.now;
                  console.log('Hand animation completed and destroyed');
                }
              }
            );
          }
        }
      });
    } catch (e) {
      console.error('Error in showHandWithTween:', e);
      if (handSprite) {
        handSprite.destroy();
        handSprite = null;
      }
    }
  }

  hideHand(scene, card) {
    if (handSprite && handSprite.scene && !handSprite.destroyed) {
      handSprite.destroy();
      handSprite = null;
      console.log('Hand destroyed via hideHand');
    }
    lastHandTime = scene.time.now;
    if (card && card.texture) {
      lastTappedCard = card.texture.key;
    }
    console.log('Hand hidden, lastTappedCard:', lastTappedCard);
  }

  getNextFlowCard() {
    if (currentTapIndex >= tapFlow.length) {
      console.log('getNextFlowCard: Tap flow complete');
      return null;
    }
    const currentCardId = tapFlow[currentTapIndex];
    switch (currentCardId) {
      case 'A': return cardA;
      case '2': return this.card2;
      case '3': return this.card3;
      case '8': return card8Back;
      case '9': return card9;
      case '10': return card10;
      case 'j': return this.cardJ;
      case 'q': return cardQ;
      default:
        console.warn('getNextFlowCard: Invalid card ID:', currentCardId);
        return null;
    }
  }

  applycardJumpRotation(scene, card, cardBack) {
    if (!card || !card.scene || card.destroyed) {
      console.warn('applythis.cardJumpRotation: Invalid card');
      return;
    }
    this.startX = card.x,
      startY = card.y;
    this.finalX = 690,
      finalY = 1700;
    this.midX = startX + (finalX - startX) * 0.5;
    this.midY = startY - 300;
    scene.tweens.add({
      targets: [card, cardBack].filter(Boolean),
      x: midX,
      y: midY,
      duration: 300,
      ease: 'Quad.easeOut',
      onStart: () => {
        console.log('Jump tween started for:', card.texture.key);
      },
      onComplete: () => {
        scene.tweens.add({
          targets: [card, cardBack].filter(Boolean),
          x: finalX,
          y: finalY,
          duration: 300,
          ease: 'Quad.easeIn',
          onComplete: () => {
            [card, cardBack].filter(Boolean).forEach(target => {
              target.setScale(0.7);
              target.setAngle(0);
              target.setDepth(maxDepth++);
            });
            console.log('Final move tween completed for:', card.texture.key, 'at:', card.x, card.y);
            // No enableCardTap here; handled in enableCardTap after tap
          }
        });
      }
    });
    scene.tweens.add({
      targets: [card, cardBack].filter(Boolean),
      angle: 360,
      duration: 600,
      ease: 'Linear',
      onComplete: () => {
        [card, cardBack].filter(Boolean).forEach(target => target.setAngle(0));
        console.log('Rotation completed for:', card.texture.key);
      }
    });
  }

  flipCard(scene, card, cardBack, fixedDepth) {
    if (!scene || !scene.sys || !scene.sys.isActive()) {
      console.warn('flipCard skipped: Invalid or inactive scene');
      return;
    }
    if (!card || !card.scene || card.destroyed) {
      console.warn(`flipCard skipped: Invalid or destroyed card ${card ? card.texture.key : 'undefined'}`);
      return;
    }
    console.log('Flipping card:', card.texture.key, 'with fixedDepth:', fixedDepth);
    if (!cardBack || !cardBack.scene || cardBack.destroyed) {
      console.warn(`flipCard: No valid cardBack for card ${card.texture.key}`);
      card.setVisible(true);
      card.setAlpha(1);
      card.setScale(0.7);
      if (fixedDepth !== undefined) {
        card.setDepth(fixedDepth);
      } else {
        card.setDepth(maxDepth++);
      }
      return;
    }
    card.setVisible(false);
    card.setAlpha(0);
    card.setScale(0, 0.7);
    scene.tweens.add({
      targets: cardBack,
      scaleX: 0,
      duration: 150,
      ease: 'Linear',
      onComplete: () => {
        if (cardBack && cardBack.scene && !cardBack.destroyed) {
          cardBack.destroy();
          cardBack = null;
        }
        if (card && card.scene && !card.destroyed) {
          card.setVisible(true);
          card.setAlpha(1);
          scene.tweens.add({
            targets: card,
            scaleX: 0.7,
            duration: 150,
            ease: 'Linear',
            onComplete: () => {
              card.setScale(0.7, 0.7);
              if (fixedDepth !== undefined) {
                card.setDepth(fixedDepth);
              } else {
                card.setDepth(maxDepth++);
              }
              console.log(`Flip completed for card: ${card.texture.key}, x: ${card.x}, y: ${card.y}, depth: ${card.depth}`);
            }
          });
        }
      }
    });
  }

  moveToK(scene, card, cardBack) {
    console.log('Starting moveToK for:', card.texture.key, 'from:', card.x, card.y);
    card.setDepth(maxDepth++);
    if (cardBack) cardBack.setDepth(maxDepth++);
    if (card.texture.key === 'card-8') {
      scene.tweens.add({
        targets: [card, cardBack].filter(Boolean),
        x: 690,
        y: 1700,
        duration: 300,
        ease: 'Power1',
        onStart: () => {
          console.log('Move tween started for:', card.texture.key);
        },
        onComplete: () => {
          [card, cardBack].filter(Boolean).forEach(target => {
            target.setScale(0.7);
            target.setAngle(0);
            target.setDepth(maxDepth++);
          });
          console.log('Move tween completed for:', card.texture.key, 'at:', card.x, card.y);
          // No enableCardTap here; handled in enableCardTap after tap
        }
      });
    } else if (card.texture.key === 'card-Q') {
      scene.tweens.add({
        targets: [card, cardBack].filter(Boolean),
        x: card.x + 30,
        y: card.y - 100,
        angle: 0,
        duration: 300,
        ease: 'Quad.easeOut',
        onStart: () => {
          console.log('Jump tween started for card-Q');
        },
        onComplete: () => {
          scene.tweens.add({
            targets: [card, cardBack].filter(Boolean),
            x: 690,
            y: 1700,
            duration: 300,
            ease: 'Quad.easeIn',
            onComplete: () => {
              [card, cardBack].filter(Boolean).forEach(target => {
                target.setScale(0.7);
                target.setAngle(0);
                target.setDepth(maxDepth++);
              });
              console.log('Final move tween completed for card-Q at:', card.x, card.y);
              // No enableCardTap here; handled in enableCardTap after tap
            }
          });
        }
      });
    } else {
      applythis.cardJumpRotation(scene, card, cardBack);
    }
  }

  disappearCardsAndTalon(scene) {
    const allCards = [
      cardA, cardABack, this.card2, this.card2Back, this.card3, this.card3Back,
      card8, card8Back, card9, card9Back, card10, card10Back,
      this.cardJ, this.cardJBack, cardQ, cardQBack, cardK
    ].filter(Boolean);
    scene.tweens.add({
      targets: [...allCards, talonBase, messageBox].filter(Boolean),
      alpha: 0,
      duration: 60,
      ease: 'Power1',
      onComplete: () => {
        allCards.forEach(obj => {
          if (obj && obj.scene && !obj.destroyed) obj.destroy();
        });
        if (talonBase && talonBase.scene && !talonBase.destroyed) talonBase.destroy();
        if (messageBox && messageBox.scene && !messageBox.destroyed) messageBox.destroy();
        console.log('Cards, talon base, and message box disappeared');
        showCompletionObjects(scene);
      }
    });
  }

  showCompletionObjects(scene) {
    scene.sound.play('WinTrumpet');
    scene.tweens.add({
      targets: congrats,
      scale: 1.6,
      alpha: 1,
      duration: 300,
      ease: 'Power1',
      onStart: () => {
        console.log('Showing Congrats');
      }
    });
    scene.tweens.add({
      targets: star,
      scale: 0.7,
      alpha: 0,
      duration: 0,
      onComplete: () => {
        scene.tweens.add({
          targets: star,
          scale: 1.54,
          alpha: 1,
          duration: 150,
          ease: 'Power1',
          onComplete: () => {
            scene.tweens.add({
              targets: star,
              scale: 1.33,
              duration: 100,
              ease: 'Power1',
              onComplete: () => {
                scene.tweens.add({
                  targets: star,
                  scale: 1.4,
                  duration: 100,
                  ease: 'Power1'
                });
              }
            });
          }
        });
      }
    });
    scene.tweens.add({
      targets: starGlow,
      scale: 1.6 * 1.5,
      alpha: 1,
      duration: 300,
      ease: 'Power1',
      onStart: () => {
        console.log('Showing Star-Glow');
      }
    });
    scene.tweens.add({
      targets: starGlow,
      angle: 360,
      duration: 1000,
      ease: 'Linear',
      repeat: -1
    });
    scene.time.delayedCall(1000, () => {
      scene.tweens.add({
        targets: [fade, congrats].filter(Boolean),
        alpha: 0,
        duration: 300,
        ease: 'Power1',
        onStart: () => {
          console.log('Fading out fade and Congrats');
        },
        onComplete: () => {
          if (fade && fade.scene && !fade.destroyed) fade.destroy();
          if (congrats && congrats.scene && !congrats.destroyed) congrats.destroy();
          console.log('Fade and Congrats disappeared');
        }
      });
      scene.tweens.add({
        targets: star,
        scale: 1.54,
        duration: 150,
        ease: 'Power1',
        onStart: () => {
          console.log('Scaling up Star for disappearance');
        },
        onComplete: () => {
          scene.tweens.add({
            targets: star,
            scale: 0.28,
            alpha: 0,
            duration: 300,
            ease: 'Power1',
            onComplete: () => {
              if (star && star.scene && !star.destroyed) star.destroy();
              console.log('Star destroyed');
            }
          });
        }
      });
      scene.tweens.add({
        targets: starGlow,
        scale: 1.54 * 2,
        duration: 150,
        ease: 'Power1',
        onStart: () => {
          console.log('Scaling up Star-Glow for disappearance');
        },
        onComplete: () => {
          scene.tweens.add({
            targets: starGlow,
            scale: 0.28 * 2,
            alpha: 0,
            duration: 300,
            ease: 'Power1',
            onComplete: () => {
              if (starGlow && starGlow.scene && !starGlow.destroyed) starGlow.destroy();
              console.log('Star-Glow destroyed');
              scene.tweens.add({
                targets: selectColorUI,
                y: 1600,
                scale: 2,
                alpha: 1,
                duration: 300,
                ease: 'Power1',
                onStart: () => {
                  console.log('Tweening Select-color-UI to y: 1600');
                }
              });
              scene.tweens.add({
                targets: selectColorGreen,
                x: 541,
                y: 1635,
                scale: 2,
                alpha: 1,
                duration: 300,
                ease: 'Power1',
                onStart: () => {
                  console.log('Tweening Select-color-Green to x: 541, y: 1635');
                }
              });
              scene.tweens.add({
                targets: selectColorPurple,
                x: 242,
                y: 1635,
                scale: 2,
                alpha: 1,
                duration: 300,
                ease: 'Power1',
                onStart: () => {
                  console.log('Tweening Select-color-Purple to x: 242, y: 1635');
                }
              });
              scene.tweens.add({
                targets: selectColorRed,
                x: 840,
                y: 1635,
                scale: 2,
                alpha: 1,
                duration: 300,
                ease: 'Power1',
                onStart: () => {
                  console.log('Tweening Select-color-Red to x: 840, y: 1635');
                }
              });
              scene.tweens.add({
                targets: ctaOK,
                y: 2200,
                scale: 2,
                alpha: 1,
                duration: 300,
                ease: 'Power1',
                onStart: () => {
                  console.log('Tweening CTA-OK to y: 2200');
                },
                onComplete: () => {
                  console.log('Select-color objects and CTA-OK tween completed');
                  [selectColorGreen, selectColorPurple, selectColorRed, ctaOK].forEach(obj => {
                    if (obj && obj.scene && !obj.destroyed) {
                      obj.setInteractive({
                        pixelPerfect: true,
                        hitArea: new Phaser.Geom.Rectangle(-50, -50, 100, 100),
                        hitAreaCallback: Phaser.Geom.Rectangle.Contains
                      });
                    } else {
                      console.warn('Cannot set interactive, object invalid:', obj ? obj.texture.key : null);
                    }
                  });
                  if (selectColorGreen) {
                    selectColorGreen.on('pointerdown', () => {
                      console.log('Tapped Select-color-Green');
                      lastColorInputTime = scene.time.now;
                      hideHand(scene, null);
                      scene.sound.play('Button');
                      scene.tweens.add({
                        targets: selectColorGreen,
                        scale: 2.1,
                        duration: 200,
                        yoyo: true,
                        onComplete: () => {
                          replacePlane(scene, 'Plane-Green');
                        }
                      });
                    });
                  }
                  if (selectColorPurple) {
                    selectColorPurple.on('pointerdown', () => {
                      console.log('Tapped Select-color-Purple');
                      lastColorInputTime = scene.time.now;
                      hideHand(scene, null);
                      scene.sound.play('Button');
                      scene.tweens.add({
                        targets: selectColorPurple,
                        scale: 2.2,
                        duration: 100,
                        yoyo: true,
                        onComplete: () => {
                          replacePlane(scene, 'Plane-Purple');
                        }
                      });
                    });
                  }
                  if (selectColorRed) {
                    selectColorRed.on('pointerdown', () => {
                      console.log('Tapped Select-color-Red');
                      lastColorInputTime = scene.time.now;
                      hideHand(scene, null);
                      scene.sound.play('Button');
                      scene.tweens.add({
                        targets: selectColorRed,
                        scale: 2.2,
                        duration: 100,
                        yoyo: true,
                        onComplete: () => {
                          replacePlane(scene, 'Plane-Red');
                        }
                      });
                    });
                  }
                  if (ctaOK) {
                    ctaOK.on('pointerdown', () => {
                      console.log('Tapped CTA-OK');
                      lastColorInputTime = scene.time.now;
                      hideHand(scene, null);
                      scene.sound.play('Button');
                      scene.tweens.add({
                        targets: ctaOK,
                        scale: 2.2,
                        duration: 100,
                        yoyo: true,
                        onComplete: () => {
                          scene.tweens.add({
                            targets: fade,
                            alpha: 1,
                            duration: 300,
                            ease: 'Power1',
                            onComplete: () => {
                              window.location.href = 'https://play.google.com/store/apps/details?id=com.brightpointstudios.apps.castle_royal';
                            }
                          });
                        }
                      });
                    });
                  }
                  colorSelectionActive = true;
                  lastColorInputTime = scene.time.now;
                  colorSelectionStartTime = scene.time.now;
                  console.log('Color selection UI activated', {
                    colorSelectionActive,
                    lastColorInputTime,
                    greenValid: !!(selectColorGreen && selectColorGreen.scene && !selectColorGreen.destroyed),
                    purpleValid: !!(selectColorPurple && selectColorPurple.scene && !selectColorPurple.destroyed),
                    redValid: !!(selectColorRed && selectColorRed.scene && !selectColorRed.destroyed),
                    ctaOKValid: !!(ctaOK && ctaOK.scene && !ctaOK.destroyed),
                    handFramesAvailable
                  });
                }
              });
            }
          });
        }
      });
    });
  }

  replacePlane(scene, planeKey) {
    console.log(`Replacing plane with ${planeKey}`);
    hideHand(scene, null);
    this.currentPlane = scene.children.getByName('currentPlane');
    if (currentPlane) currentPlane.destroy();
    if (planeGlow && planeGlow.scene && !planeGlow.destroyed) {
      planeGlow.destroy();
    }
    currentPlane = scene.add.image(540, 970, planeKey).setOrigin(0.5).setDepth(1).setName('currentPlane');
    currentPlane.setDisplaySize(502 * 1.7, 373 * 1.7);
    planeGlow = scene.add.image(539, 940, 'Plane-Selected-Glow').setOrigin(0.5).setDepth(2).setAlpha(0);
    planeGlow.setDisplaySize(527 * 1.7, 362 * 1.7);
    scene.tweens.add({
      targets: planeGlow,
      alpha: 1,
      duration: 300,
      ease: 'Power1',
      onStart: () => {
        console.log('Fading in Plane-Selected-Glow');
      },
      onComplete: () => {
        console.log('Plane-Selected-Glow visible');
      }
    });
    scene.tweens.add({
      targets: ctaOK,
      y: 1850,
      scale: 2,
      duration: 300,
      ease: 'Power1',
      onStart: () => {
        console.log('Tweening CTA-OK to y: 1850 after plane selection');
      }
    });
    lastColorInputTime = scene.time.now;
  }

  shakeCard(scene, card) {
    if (!card || !card.scene || card.destroyed || card.shaking) {
      console.warn('shakeCard skipped: Invalid card or already shaking');
      return;
    }
    card.shaking = true;
    const initialAngle = card.angle;
    console.log(`Shaking card: ${card.texture.key}, initial angle: ${initialAngle}`);
    scene.tweens.add({
      targets: card,
      angle: { from: initialAngle - 5, to: initialAngle + 5 },
      duration: 100,
      ease: 'Sine.easeInOut',
      repeat: 2,
      yoyo: true,
      onStart: () => {
        scene.sound.play('Invalid-Card');
      },
      onComplete: () => {
        if (card && card.scene && !card.destroyed) {
          card.angle = initialAngle;
          card.shaking = false;
          console.log(`Shake completed for card: ${card.texture.key}, restored angle: ${card.angle}`);
        }
      }
    });
  }

  enableCardTap(scene) {
    if (currentTapIndex >= tapFlow.length) {
      console.log('Tap flow completed, no more cards to enable');
      disappearCardsAndTalon(scene);
      return;
    }
    const currentCard = tapFlow[currentTapIndex];
    this.card, cardBack;
    switch (currentCard) {
      case 'A': card = cardA; cardBack = cardABack; break;
      case '2': card = this.card2; cardBack = this.card2Back; break;
      case '3': card = this.card3; cardBack = this.card3Back; break;
      case '8': card = card8; cardBack = card8Back; break;
      case '9': card = card9; cardBack = card9Back; break;
      case '10': card = card10; cardBack = card10Back; break;
      case 'j': card = this.cardJ; cardBack = this.cardJBack; break;
      case 'q': card = cardQ; cardBack = cardQBack; break;
    }
    if (!card || !card.scene || card.destroyed) {
      console.warn(`enableCardTap: Invalid card for ${currentCard}`);
      currentTapIndex++;
      enableCardTap(scene);
      return;
    }
    if (cardBack && (!cardBack.scene || cardBack.destroyed)) {
      console.warn(`enableCardTap: Invalid cardBack for ${currentCard}`);
      cardBack = null;
    }
    console.log(`enableCardTap: Enabling ${currentCard}, visible: ${card.visible}, back visible: ${cardBack ? cardBack.visible : 'none'}`);
    if (cardBack) {
      cardBack.setInteractive({
        pixelPerfect: true,
        hitArea: new Phaser.Geom.Rectangle(-100, -150, 200, 300),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains
      });
      cardBack.on('pointerdown', () => {
        console.log('Tapped card back:', currentCard);
        if (tapFlow[currentTapIndex] === currentCard && !completedCards.includes(card)) {
          lastInputTime = scene.time.now;
          hideHand(scene, card);
          card.setDepth(maxDepth++);
          if (cardBack) cardBack.setDepth(maxDepth++);
          console.log(`Set ${currentCard} depth to ${card.depth}, cardBack depth to ${cardBack ? cardBack.depth : 'none'}`);
          if (currentCard === 'A') scene.sound.play('Valid-card');
          else if (currentCard === '2') scene.sound.play('Valid2');
          else if (currentCard === '3') scene.sound.play('Valid3');
          else if (currentCard === '8') scene.sound.play('flip');
          else if (currentCard === '9') scene.sound.play('Valid4');
          else if (currentCard === '10') scene.sound.play('Valid-card');
          else if (currentCard === 'j') scene.sound.play('Valid2');
          else if (currentCard === 'q') scene.sound.play('Valid3');
          if (currentCard === 'A' && messageBox && messageBox.scene && !messageBox.destroyed) {
            scene.tweens.add({
              targets: messageBox,
              alpha: 0,
              duration: 300,
              ease: 'Power1',
              onComplete: () => {
                if (messageBox && messageBox.scene && !messageBox.destroyed) {
                  messageBox.destroy();
                  messageBox = null;
                  console.log('Message box destroyed after tapping card A');
                }
              }
            });
          }
          if (currentCard !== 'A') {
            if (currentCard === '8') {
              flipCard(scene, card, cardBack);
              moveToK(scene, card, cardBack);
            } else {
              flipCard(scene, card, cardBack);
              moveToK(scene, card, cardBack);
            }
          } else {
            moveToK(scene, card, cardBack);
          }
          if (currentCard === 'A') {
            flipCard(scene, this.card2, this.card2Back);
            flipCard(scene, this.card3, this.card3Back);
          } else if (currentCard === '3') {
            flipCard(scene, card9, card9Back);
            flipCard(scene, card10, card10Back);
          } else if (currentCard === '10') {
            const jDepth = maxDepth + 2;
            maxDepth += 4;
            this.cardJ.setDepth(jDepth);
            if (this.cardJBack) this.cardJBack.setDepth(jDepth + 1);
            flipCard(scene, this.cardJ, this.cardJBack, jDepth);
          } else if (currentCard === 'j') {
            const qDepth = maxDepth + 2;
            maxDepth += 4;
            cardQ.setDepth(qDepth);
            if (cardQBack) cardQBack.setDepth(qDepth + 1);
            flipCard(scene, cardQ, cardQBack, qDepth);
          }
          completedCards.push(card);
          currentTapIndex++;
          console.log('Advancing to next card, currentTapIndex:', currentTapIndex);
          enableCardTap(scene); // Enable next card immediately
        }
      });
    }
    if (card) {
      card.setInteractive({
        pixelPerfect: true,
        hitArea: new Phaser.Geom.Rectangle(-100, -150, 200, 300),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains
      });
      card.on('pointerdown', () => {
        console.log('Tapped card face:', currentCard);
        if (tapFlow[currentTapIndex] === currentCard && !completedCards.includes(card)) {
          lastInputTime = scene.time.now;
          hideHand(scene, card);
          card.setDepth(maxDepth++);
          if (cardBack) cardBack.setDepth(maxDepth++);
          console.log(`Set ${currentCard} depth to ${card.depth}, cardBack depth to ${cardBack ? cardBack.depth : 'none'}`);
          if (currentCard === 'A') scene.sound.play('Valid-card');
          else if (currentCard === '2') scene.sound.play('Valid2');
          else if (currentCard === '3') scene.sound.play('Valid3');
          else if (currentCard === '8') scene.sound.play('flip');
          else if (currentCard === '9') scene.sound.play('Valid4');
          else if (currentCard === '10') scene.sound.play('Valid-card');
          else if (currentCard === 'j') scene.sound.play('Valid2');
          else if (currentCard === 'q') scene.sound.play('Valid3');
          if (currentCard === 'A' && messageBox && messageBox.scene && !messageBox.destroyed) {
            scene.tweens.add({
              targets: messageBox,
              alpha: 0,
              duration: 300,
              ease: 'Power1',
              onComplete: () => {
                if (messageBox && messageBox.scene && !messageBox.destroyed) {
                  messageBox.destroy();
                  messageBox = null;
                  console.log('Message box destroyed after tapping card A');
                }
              }
            });
          }
          if (currentCard !== 'A') {
            if (currentCard === '8') {
              flipCard(scene, card, cardBack);
              moveToK(scene, card, cardBack);
            } else {
              flipCard(scene, card, cardBack);
              moveToK(scene, card, cardBack);
            }
          } else {
            moveToK(scene, card, cardBack);
          }
          if (currentCard === 'A') {
            flipCard(scene, this.card2, this.card2Back);
            flipCard(scene, this.card3, this.card3Back);
          } else if (currentCard === '3') {
            flipCard(scene, card9, card9Back);
            flipCard(scene, card10, card10Back);
          } else if (currentCard === '10') {
            const jDepth = maxDepth + 2;
            maxDepth += 4;
            this.cardJ.setDepth(jDepth);
            if (this.cardJBack) this.cardJBack.setDepth(jDepth + 1);
            flipCard(scene, this.cardJ, this.cardJBack, jDepth);
          } else if (currentCard === 'j') {
            const qDepth = maxDepth + 2;
            maxDepth += 4;
            cardQ.setDepth(qDepth);
            if (cardQBack) cardQBack.setDepth(qDepth + 1);
            flipCard(scene, cardQ, cardQBack, qDepth);
          }
          completedCards.push(card);
          currentTapIndex++;
          console.log('Advancing to next card, currentTapIndex:', currentTapIndex);
          enableCardTap(scene); // Enable next card immediately
        }
      });
    }
  }

  //   create() {
  //     const bgm = this.getMusicRef();
  //     if (bgm && !bgm.isPlaying) bgm.play();
  //     window.originalSceneTwoCreate.call(this);
  //   }

  //   update(time, delta) {
  //     window.originalSceneTwoUpdate.call(this, time, delta);
  //   }
  // }

  // --- Game Logic Extracted From index2.html ---

  // ... [global variables and helpers assumed to be declared above this block] ...

  create() {
    try {
      this.preloadHandFrames(this);
  
      this.planeGlow = null;
      this.maxDepth = 10;
      this.cardsInitialized = false;
      this.lastInputTime = 0;
      this.lastHandTime = 0;
  
      this.input.setTopOnly(false);
      console.log('Input system initialized:', this.input.active);
  
      const bg = this.add.image(540, 960, 'Repaire-Plane_BG').setOrigin(0.5).setDepth(0);
      bg.setDisplaySize(1080, 1920);
  
      this.currentPlane = this.add.image(540, 970, 'Plane-Broken').setOrigin(0.5).setDepth(1).setName('currentPlane');
      this.currentPlane.setDisplaySize(502 * 1.7, 373 * 1.7);
  
      this.fade = this.add.image(540, 960, 'fade').setOrigin(0.5).setDepth(3).setAlpha(0.9);
  
      const logo = this.add.image(140, 80, 'logo').setOrigin(0.5).setDepth(8).setScale(0.5);
      const cta = this.add.image(900, 80, 'cta').setOrigin(0.5).setDepth(9).setScale(1.1);
  
      cta.setInteractive({
        pixelPerfect: true,
        hitArea: new Phaser.Geom.Rectangle(-50, -50, 100, 100),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains
      });
  
      cta.on('pointerdown', () => {
        console.log('Tapped existing CTA');
        this.sound.play('Button');
        this.tweens.add({
          targets: cta,
          scale: 1.2,
          duration: 100,
          yoyo: true,
          onComplete: () => {
            this.tweens.add({
              targets: this.fade,
              alpha: 1,
              duration: 300,
              ease: 'Power1',
              onComplete: () => {
                window.location.href = 'https://play.google.com/store/apps/details?id=com.brightpointstudios.apps.castle_royal';
              }
            });
          }
        });
      });
  
      this.ctaOK = this.add.image(540, 2500, 'CTA-OK').setOrigin(0.5).setDepth(this.maxDepth++).setScale(2).setAlpha(0);
      this.talonBase = this.add.image(540, 1750, 'talonBase').setOrigin(0.5).setDepth(this.maxDepth++);
      this.talonBase.setDisplaySize(374 * 2, 148 * 1.9);
  
      this.messageBox = this.add.image(540, 1380, 'message').setOrigin(0.5).setDepth(this.maxDepth++);
      this.messageBox.setDisplaySize(520 * 2, 145 * 1.8);
  
      this.congrats = this.add.image(540, 600, 'Congrats').setOrigin(0.5).setDepth(this.maxDepth++).setScale(0).setAlpha(0);
      this.star = this.add.image(540, 1000, 'Star').setOrigin(0.5).setDepth(this.maxDepth++).setScale(0).setAlpha(0);
      this.starGlow = this.add.image(540, 1000, 'Star-Glow').setOrigin(0.5).setDepth(this.star.depth - 1).setScale(0).setAlpha(0);
  
      this.selectColorUI = this.add.image(540, 2500, 'Select-color-UI').setOrigin(0.5).setDepth(this.ctaOK.depth - 1).setScale(2).setAlpha(0);
      this.selectColorGreen = this.add.image(541, 2500, 'Select-color-Green').setOrigin(0.5).setDepth(this.maxDepth++).setScale(2).setAlpha(0);
      this.selectColorPurple = this.add.image(242, 2500, 'Select-color-Purple').setOrigin(0.5).setDepth(this.maxDepth++).setScale(2).setAlpha(0);
      this.selectColorRed = this.add.image(840, 2500, 'Select-color-Red').setOrigin(0.5).setDepth(this.maxDepth++).setScale(2).setAlpha(0);
  
      const initialY = -300;
      const card2FinalX = 340;
      const card3FinalX = 740;
      const cardJFinalX = 441;
      const cardQFinalX = 639;
  
      this.card2 = this.add.image(this.card2FinalX, initialY, 'card-2').setOrigin(0.5).setAngle(45).setScale(0.7).setDepth(this.maxDepth++).setVisible(false);
      this.card2Back = this.add.image(this.card2FinalX, initialY, 'card-back').setOrigin(0.5).setAngle(45).setScale(0.7).setDepth(this.maxDepth++);
  
      this.card3 = this.add.image(this.card3FinalX, initialY, 'card-3').setOrigin(0.5).setAngle(315).setScale(0.7).setDepth(this.maxDepth++).setVisible(false);
      this.card3Back = this.add.image(this.card3FinalX, initialY, 'card-back').setOrigin(0.5).setAngle(315).setScale(0.7).setDepth(this.maxDepth++);
  
      this.card8 = this.add.image(540, initialY, 'card-8').setOrigin(0.5).setScale(0.7).setDepth(this.maxDepth++).setVisible(false);
      this.card8Back = this.add.image(540, initialY, 'card-back').setOrigin(0.5).setScale(0.7).setDepth(this.maxDepth++);
  
      this.card9 = this.add.image(540, initialY, 'card-9').setOrigin(0.5).setScale(0.7).setDepth(this.maxDepth++).setVisible(false);
      this.card9Back = this.add.image(540, initialY, 'card-back').setOrigin(0.5).setScale(0.7).setDepth(this.maxDepth++);
  
      this.card10 = this.add.image(540, initialY, 'card-10').setOrigin(0.5).setScale(0.7).setDepth(this.maxDepth++).setVisible(false);
      this.card10Back = this.add.image(540, initialY, 'card-back').setOrigin(0.5).setScale(0.7).setDepth(this.maxDepth++);
  
      this.cardJ = this.add.image(cardJFinalX, initialY, 'card-j').setOrigin(0.5).setAngle(22).setScale(0.7).setDepth(this.card10.depth - 1).setVisible(false);
      this.cardJBack = this.add.image(cardJFinalX, initialY, 'card-back').setOrigin(0.5).setAngle(22).setScale(0.7).setDepth(this.card10.depth - 1);
  
      this.cardQ = this.add.image(cardQFinalX, initialY, 'card-Q').setOrigin(0.5).setAngle(337).setScale(0.7).setDepth(this.cardJ.depth - 1).setVisible(false);
      this.cardQBack = this.add.image(cardQFinalX, initialY, 'card-back').setOrigin(0.5).setAngle(337).setScale(0.7).setDepth(this.cardJ.depth - 1);
  
      this.cardA = this.add.image(540, initialY, 'card-A').setOrigin(0.5).setScale(0.7).setDepth(this.maxDepth++).setVisible(true);
      this.cardABack = this.add.image(540, initialY, 'card-back').setOrigin(0.5).setScale(0.7).setDepth(this.maxDepth++);
      this.cardK = this.add.image(540, initialY, 'card-k').setOrigin(0.5).setScale(0.7).setDepth(this.maxDepth++);
  
      
   
  
      const cardFaces = [this.cardA, this.card2, this.card3, this.card8, this.card9, this.card10, this.cardJ, this.cardQ];
      const cardIdMap = {
        'card-A': 'A',
        'card-2': '2',
        'card-3': '3',
        'card-8': '8',
        'card-9': '9',
        'card-10': '10',
        'card-j': 'j',
        'card-Q': 'q'
      };
      cardFaces.forEach((card) => {
        if (card) {
          card.on('pointerdown', () => {
            const cardId = cardIdMap[card.texture.key];
            if (cardId) {
              console.log(`Tapped card face: ${cardId}, expected: ${tapFlow[currentTapIndex]}, visible: ${card.visible}, completed: ${completedCards.includes(card)}, depth: ${card.depth}`);
              if (
                card.visible &&
                tapFlow[currentTapIndex] !== cardId &&
                !completedCards.includes(card)
              ) {
                shakeCard(this, card);
              }
            }
          });
        }
      });
      this.tweens.add({
        targets: [this.card2, this.card2Back,this.card3, this.card3Back],
        angle: (target) => {
          if (target === this.card2 || target === this.card2Back) return 75;
          if (target === this.card3 || target === this.card3Back) return -75;
          return target.angle;
        },
        duration: 300,
        ease: 'Power1',
        delay: 400
      });
      this.tweens.add({
        targets: [this.cardJ, this.cardJBack, cardQ, cardQBack],
        angle: (target) => {
          if (target === this.cardJ || target === this.cardJBack) return 45;
          if (target === cardQ || target === cardQBack) return -45;
          return target.angle;
        },
        duration: 300,
        ease: 'Power1',
        delay: 400
      });
      this.tweens.add({
        targets: [this.card2, this.card2Back, this.card3, this.card3Back, this.cardJ, this.cardJBack, cardQ, cardQBack],
        x: (target) => {
          if (target === this.card2 || target === this.card2Back) return this.card2FinalX;
          if (target === this.card3 || target === this.card3Back) return this.card3FinalX;
          if (target === this.cardJ || target === this.cardJBack) return this.cardJFinalX;
          if (target === cardQ || target === cardQBack) return cardQFinalX;
          return target.x;
        },
        y: (target) => {
          if (target === this.card2 || target === this.card2Back) return 680;
          if (target === this.card3 || target === this.card3Back) return 680;
          if (target === this.cardJ || target === this.cardJBack) return 997;
          if (target === cardQ || target === cardQBack) return 997;
          return target.y;
        },
        duration: 300,
        ease: 'Power1',
        onComplete: () => {
          this.tweens.add({
            targets: [cardA, cardABack, card8, card8Back, card9, card9Back, card10, card10Back, cardK],
            y: (target) => {
              if (target === card9 || target === card9Back) return 460;
              if (target === card10 || target === card10Back) return 850;
              if (target === cardA || target === cardABack) return 660;
              if (target === card8 || target === card8Back) return 1700;
              if (target === cardK) return 1700;
              return target.y;
            },
            duration: 300,
            ease: 'Power1',
            onComplete: () => {
              cardA.setDepth(maxDepth++);
              cardABack.setDepth(maxDepth++);
              flipCard(this, cardA, cardABack);
              this.tweens.add({
                targets: [card8, card8Back, cardK],
                x: (target) => {
                  if (target === card8 || target === card8Back) return 390;
                  if (target === cardK) return 690;
                  return target.x;
                },
                duration: 300,
                ease: 'Power1',
                onComplete: () => {
                  console.log('Enabling tap for card A');
                  console.log('Card 8 position:', { x: card8.x, y: card8.y });
                  console.log('Card K position:', { x: cardK.x, y: cardK.y });
                  enableCardTap(this);
                  lastInputTime = this.time.now;
                  lastHandTime = this.time.now + 5000;
                  cardsInitialized = true;
                  const music = this.sound.add('Game_music');
                  music.play({ loop: true });
                  console.log('Game_music started');
                }
              });
            }
          });
        }
      });
    } catch (e) {
      console.error('Error in create:', e);
    }
  }

  update(time, delta) {
    try {
      this.handLogState = '';
  
      if (!this.cardsInitialized) {
        this.handLogState = 'not_initialized';
      } else if (this.currentTapIndex >= this.tapFlow.length) {
        this.handLogState = 'flow_complete';
      } else if (time - this.lastHandTime < 3000) {
        this.handLogState = 'timing';
      } else if (this.handSprite && this.handSprite.scene && !this.handSprite.destroyed) {
        this.handLogState = 'hand_active';
      }
  
      if (this.handLogState && this.handLogState !== this.lastHandLogState) {
        console.log(`Skipping hand display: ${this.handLogState}`);
        this.lastHandLogState = this.handLogState;
      }
  
      if (!this.handLogState && !this.colorSelectionActive) {
        const nextCard = this.getNextFlowCard();
        this.nextCard = nextCard;
        this.cardState = nextCard
          ? `nextCard=${nextCard.texture.key}, visible=${nextCard.visible}`
          : 'nextCard=none';
  
        if (
          nextCard &&
          nextCard.scene &&
          !nextCard.destroyed &&
          nextCard.visible &&
          nextCard.texture &&
          nextCard.texture.key !== this.lastTappedCard &&
          time - this.lastInputTime >= 3000
        ) {
          if (this.lastHandLogState !== 'showing') {
            console.log(`Showing hand for card: ${nextCard.texture.key}`);
            this.lastHandLogState = 'showing';
          }
          this.showHandWithTween(this, nextCard);
        } else if (this.lastHandLogState !== 'invalid') {
          console.log(`Skipping hand: Invalid nextCard or conditions not met (${this.cardState})`);
          this.lastHandLogState = 'invalid';
        }
      }
  
      if (
        this.colorSelectionActive &&
        time - this.lastColorInputTime >= 3000 &&
        time - this.lastHandTime >= 3000 &&
        (!this.handSprite || !this.handSprite.scene || this.handSprite.destroyed)
      ) {
        const colorOptions = [this.selectColorGreen, this.selectColorPurple, this.selectColorRed]
          .filter(opt => opt && opt.scene && !opt.destroyed);
  
        this.currentPlane = this.children.getByName('currentPlane');
        const planeSelected = this.currentPlane && this.currentPlane.texture.key !== 'Plane-Broken';
  
        if (colorOptions.length > 0 && !planeSelected) {
          const randomOption = colorOptions[Math.floor(Math.random() * colorOptions.length)];
          console.log(`Showing hand for color option: ${randomOption.texture.key}`);
          this.showHandWithTween(this, randomOption);
          this.lastHandTime = time;
        }
      }
    } catch (e) {
      console.error('Error in update:', e);
    }
  }}
  

// Bind to window for SceneTwo to call
// window.originalSceneTwoCreate = create;
// window.originalSceneTwoUpdate = update;
