/**
 * THIS FILE IS AUTO-GENERATED — DO NOT EDIT.
 * It contains the `editorElement` portion of the manifest, automatically derived from your component's
 * source code, prop types, and CSS rules.
 * Update your source code and run `npx wix build && npx wix generate manifest` to regenerate it.
 * If you need to override specific manifest values (sizing, layout, etc.),
 * you can do so in testimonials-grid.extension.ts.
 */

import type { EditorElement } from '@wix/react-component-schema';

export const editorElement = {
  "selector": ".testimonials-grid",
  "displayName": "Testimonials Grid",
  "data": {
    "direction": {
      "displayName": "Direction",
      "dataType": "direction"
    },
    "title": {
      "displayName": "Title",
      "dataType": "text",
      "text": {}
    },
    "subtitle": {
      "displayName": "Subtitle",
      "dataType": "text",
      "text": {}
    },
    "ratingSummary": {
      "displayName": "Rating Summary",
      "dataType": "text",
      "text": {}
    },
    "testimonials": {
      "displayName": "Testimonials",
      "dataType": "arrayItems",
      "arrayItems": {
        "data": {
          "items": {
            "name": {
              "displayName": "Name",
              "dataType": "text",
              "text": {}
            },
            "authorName": {
              "displayName": "Author Name",
              "dataType": "text",
              "text": {}
            },
            "authorRole": {
              "displayName": "Author Role",
              "dataType": "text",
              "text": {}
            },
            "avatar": {
              "displayName": "Avatar",
              "dataType": "image",
              "image": {
                "category": "IMAGE"
              }
            },
            "rating": {
              "displayName": "Rating",
              "dataType": "number",
              "number": {}
            },
            "quoteText": {
              "displayName": "Quote Text",
              "dataType": "text",
              "text": {}
            },
            "verifiedBadge": {
              "displayName": "Verified Badge",
              "dataType": "text",
              "text": {}
            }
          }
        }
      }
    }
  },
  "elements": {
    "testimonialsGridHeader": {
      "elementType": "inlineElement",
      "inlineElement": {
        "selector": ".testimonials-grid-header",
        "displayName": "Header",
        "behaviors": {
          "removable": true,
          "selectable": false
        },
        "cssProperties": {
          "background": {},
          "borderTop": {},
          "borderBottom": {},
          "borderInlineStart": {},
          "borderInlineEnd": {},
          "paddingTop": {
            "defaultValue": "0"
          },
          "paddingBottom": {
            "defaultValue": "0"
          },
          "paddingInlineStart": {
            "defaultValue": "0"
          },
          "paddingInlineEnd": {
            "defaultValue": "0"
          },
          "borderStartStartRadius": {},
          "borderStartEndRadius": {},
          "borderEndStartRadius": {},
          "borderEndEndRadius": {},
          "boxShadow": {},
          "width": {},
          "height": {},
          "overflow": {},
          "mixBlendMode": {
            "defaultValue": "normal"
          },
          "display": {
            "display": {
              "displayValues": [
                "none",
                "flex"
              ]
            }
          },
          "marginTop": {},
          "marginBottom": {},
          "marginInlineStart": {},
          "marginInlineEnd": {},
          "gap": {
            "defaultValue": "8px"
          },
          "justifyContent": {},
          "alignItems": {
            "defaultValue": "center"
          },
          "alignSelf": {}
        },
        "elements": {
          "testimonialsGridTitle": {
            "elementType": "inlineElement",
            "inlineElement": {
              "selector": ".testimonials-grid-title",
              "displayName": "Title",
              "behaviors": {
                "removable": true,
                "selectable": false
              },
              "cssProperties": {
                "font": {
                  "defaultValue": "700 28px/1.25 inherit,sans-serif"
                },
                "lineHeight": {
                  "defaultValue": "1.25"
                },
                "letterSpacing": {},
                "textDecorationLine": {},
                "textTransform": {},
                "textAlign": {},
                "textShadow": {},
                "color": {
                  "defaultValue": "#0f172a"
                },
                "marginTop": {
                  "defaultValue": "0"
                },
                "marginBottom": {
                  "defaultValue": "0"
                },
                "marginInlineStart": {
                  "defaultValue": "0"
                },
                "marginInlineEnd": {
                  "defaultValue": "0"
                },
                "display": {
                  "display": {
                    "displayValues": [
                      "none",
                      "block"
                    ]
                  }
                },
                "alignSelf": {}
              }
            }
          },
          "testimonialsGridSubtitle": {
            "elementType": "inlineElement",
            "inlineElement": {
              "selector": ".testimonials-grid-subtitle",
              "displayName": "Subtitle",
              "behaviors": {
                "removable": true,
                "selectable": false
              },
              "cssProperties": {
                "font": {
                  "defaultValue": "400 16px/1.5 inherit,sans-serif"
                },
                "lineHeight": {
                  "defaultValue": "1.5"
                },
                "letterSpacing": {},
                "textDecorationLine": {},
                "textTransform": {},
                "textAlign": {},
                "textShadow": {},
                "color": {
                  "defaultValue": "#64748b"
                },
                "marginTop": {
                  "defaultValue": "0"
                },
                "marginBottom": {
                  "defaultValue": "0"
                },
                "marginInlineStart": {
                  "defaultValue": "0"
                },
                "marginInlineEnd": {
                  "defaultValue": "0"
                },
                "display": {
                  "display": {
                    "displayValues": [
                      "none",
                      "block"
                    ]
                  }
                },
                "alignSelf": {}
              }
            }
          },
          "testimonialsGridRatingSummary": {
            "elementType": "inlineElement",
            "inlineElement": {
              "selector": ".testimonials-grid-rating-summary",
              "displayName": "Rating Summary",
              "behaviors": {
                "removable": true,
                "selectable": false
              },
              "cssProperties": {
                "font": {
                  "defaultValue": "600 13px inherit,sans-serif"
                },
                "lineHeight": {},
                "letterSpacing": {},
                "textDecorationLine": {},
                "textTransform": {},
                "textAlign": {},
                "textShadow": {},
                "color": {
                  "defaultValue": "#92400e"
                },
                "display": {
                  "display": {
                    "displayValues": [
                      "none",
                      "inlineFlex"
                    ]
                  }
                },
                "marginTop": {
                  "defaultValue": "4px"
                },
                "marginBottom": {},
                "marginInlineStart": {},
                "marginInlineEnd": {},
                "background": {
                  "defaultValue": "#fef3c7"
                },
                "borderTop": {},
                "borderBottom": {},
                "borderInlineStart": {},
                "borderInlineEnd": {},
                "paddingTop": {
                  "defaultValue": "4px"
                },
                "paddingBottom": {
                  "defaultValue": "4px"
                },
                "paddingInlineStart": {
                  "defaultValue": "12px"
                },
                "paddingInlineEnd": {
                  "defaultValue": "12px"
                },
                "borderStartStartRadius": {
                  "defaultValue": "9999px"
                },
                "borderStartEndRadius": {
                  "defaultValue": "9999px"
                },
                "borderEndStartRadius": {
                  "defaultValue": "9999px"
                },
                "borderEndEndRadius": {
                  "defaultValue": "9999px"
                },
                "boxShadow": {},
                "width": {},
                "height": {},
                "overflow": {},
                "mixBlendMode": {
                  "defaultValue": "normal"
                },
                "justifyContent": {},
                "alignItems": {
                  "defaultValue": "center"
                },
                "alignSelf": {}
              }
            }
          }
        }
      }
    },
    "testimonialsGridContainer": {
      "elementType": "inlineElement",
      "inlineElement": {
        "selector": ".testimonials-grid-container",
        "displayName": "Container",
        "behaviors": {
          "removable": true,
          "selectable": false
        },
        "cssProperties": {
          "background": {},
          "borderTop": {},
          "borderBottom": {},
          "borderInlineStart": {},
          "borderInlineEnd": {},
          "paddingTop": {
            "defaultValue": "0"
          },
          "paddingBottom": {
            "defaultValue": "0"
          },
          "paddingInlineStart": {
            "defaultValue": "0"
          },
          "paddingInlineEnd": {
            "defaultValue": "0"
          },
          "borderStartStartRadius": {},
          "borderStartEndRadius": {},
          "borderEndStartRadius": {},
          "borderEndEndRadius": {},
          "boxShadow": {},
          "width": {},
          "height": {},
          "overflow": {},
          "mixBlendMode": {
            "defaultValue": "normal"
          },
          "display": {
            "display": {
              "displayValues": [
                "none",
                "grid"
              ]
            }
          },
          "marginTop": {},
          "marginBottom": {},
          "marginInlineStart": {},
          "marginInlineEnd": {},
          "gap": {
            "defaultValue": "20px"
          },
          "justifyContent": {},
          "alignItems": {},
          "alignSelf": {}
        },
        "elements": {
          "testimonialsGridCard": {
            "elementType": "inlineElement",
            "inlineElement": {
              "selector": ".testimonials-grid-card",
              "displayName": "Card",
              "behaviors": {
                "removable": true,
                "selectable": false
              },
              "cssProperties": {
                "background": {
                  "defaultValue": "#f8fafc"
                },
                "borderTop": {
                  "defaultValue": "1px solid #e2e8f0"
                },
                "borderBottom": {
                  "defaultValue": "1px solid #e2e8f0"
                },
                "borderInlineStart": {
                  "defaultValue": "1px solid #e2e8f0"
                },
                "borderInlineEnd": {
                  "defaultValue": "1px solid #e2e8f0"
                },
                "paddingTop": {
                  "defaultValue": "20px"
                },
                "paddingBottom": {
                  "defaultValue": "20px"
                },
                "paddingInlineStart": {
                  "defaultValue": "20px"
                },
                "paddingInlineEnd": {
                  "defaultValue": "20px"
                },
                "borderStartStartRadius": {
                  "defaultValue": "10px"
                },
                "borderStartEndRadius": {
                  "defaultValue": "10px"
                },
                "borderEndStartRadius": {
                  "defaultValue": "10px"
                },
                "borderEndEndRadius": {
                  "defaultValue": "10px"
                },
                "boxShadow": {},
                "width": {},
                "height": {},
                "overflow": {},
                "mixBlendMode": {
                  "defaultValue": "normal"
                },
                "display": {
                  "display": {
                    "displayValues": [
                      "none",
                      "flex"
                    ]
                  }
                },
                "marginTop": {},
                "marginBottom": {},
                "marginInlineStart": {},
                "marginInlineEnd": {},
                "gap": {
                  "defaultValue": "16px"
                },
                "justifyContent": {
                  "defaultValue": "space-between"
                },
                "alignItems": {},
                "alignSelf": {}
              },
              "elements": {
                "testimonialsGridStars": {
                  "elementType": "inlineElement",
                  "inlineElement": {
                    "selector": ".testimonials-grid-stars",
                    "displayName": "Stars",
                    "behaviors": {
                      "removable": true,
                      "selectable": false
                    },
                    "cssProperties": {
                      "borderTop": {},
                      "borderBottom": {},
                      "borderInlineStart": {},
                      "borderInlineEnd": {},
                      "borderStartStartRadius": {},
                      "borderStartEndRadius": {},
                      "borderEndStartRadius": {},
                      "borderEndEndRadius": {},
                      "boxShadow": {},
                      "width": {},
                      "height": {},
                      "overflow": {},
                      "objectFit": {},
                      "objectPosition": {},
                      "mixBlendMode": {
                        "defaultValue": "normal"
                      },
                      "display": {
                        "display": {
                          "displayValues": [
                            "none",
                            "flex"
                          ]
                        }
                      },
                      "marginTop": {},
                      "marginBottom": {},
                      "marginInlineStart": {},
                      "marginInlineEnd": {},
                      "justifyContent": {},
                      "alignItems": {
                        "defaultValue": "center"
                      },
                      "alignSelf": {}
                    }
                  }
                },
                "testimonialsGridQuote": {
                  "elementType": "inlineElement",
                  "inlineElement": {
                    "selector": ".testimonials-grid-quote",
                    "displayName": "Quote",
                    "behaviors": {
                      "removable": true,
                      "selectable": false
                    },
                    "cssProperties": {
                      "background": {},
                      "borderTop": {},
                      "borderBottom": {},
                      "borderInlineStart": {},
                      "borderInlineEnd": {},
                      "paddingTop": {
                        "defaultValue": "0"
                      },
                      "paddingBottom": {
                        "defaultValue": "0"
                      },
                      "paddingInlineStart": {
                        "defaultValue": "0"
                      },
                      "paddingInlineEnd": {
                        "defaultValue": "0"
                      },
                      "borderStartStartRadius": {},
                      "borderStartEndRadius": {},
                      "borderEndStartRadius": {},
                      "borderEndEndRadius": {},
                      "boxShadow": {},
                      "width": {},
                      "height": {},
                      "overflow": {},
                      "mixBlendMode": {
                        "defaultValue": "normal"
                      },
                      "marginTop": {
                        "defaultValue": "0"
                      },
                      "marginBottom": {
                        "defaultValue": "0"
                      },
                      "marginInlineStart": {
                        "defaultValue": "0"
                      },
                      "marginInlineEnd": {
                        "defaultValue": "0"
                      },
                      "display": {
                        "display": {
                          "displayValues": [
                            "none",
                            "block"
                          ]
                        }
                      },
                      "font": {
                        "defaultValue": "italic 15px/1.6 inherit,sans-serif"
                      },
                      "lineHeight": {
                        "defaultValue": "1.6"
                      },
                      "letterSpacing": {},
                      "textDecorationLine": {},
                      "textTransform": {},
                      "textAlign": {},
                      "textShadow": {},
                      "color": {
                        "defaultValue": "#334155"
                      },
                      "alignSelf": {}
                    }
                  }
                },
                "testimonialsGridAuthorRow": {
                  "elementType": "inlineElement",
                  "inlineElement": {
                    "selector": ".testimonials-grid-author-row",
                    "displayName": "Author Row",
                    "behaviors": {
                      "removable": true,
                      "selectable": false
                    },
                    "cssProperties": {
                      "background": {},
                      "borderTop": {
                        "defaultValue": "1px solid #e2e8f0"
                      },
                      "borderBottom": {},
                      "borderInlineStart": {},
                      "borderInlineEnd": {},
                      "paddingTop": {
                        "defaultValue": "12px"
                      },
                      "paddingBottom": {
                        "defaultValue": "0"
                      },
                      "paddingInlineStart": {
                        "defaultValue": "0"
                      },
                      "paddingInlineEnd": {
                        "defaultValue": "0"
                      },
                      "borderStartStartRadius": {},
                      "borderStartEndRadius": {},
                      "borderEndStartRadius": {},
                      "borderEndEndRadius": {},
                      "boxShadow": {},
                      "width": {},
                      "height": {},
                      "overflow": {},
                      "mixBlendMode": {
                        "defaultValue": "normal"
                      },
                      "display": {
                        "display": {
                          "displayValues": [
                            "none",
                            "flex"
                          ]
                        }
                      },
                      "marginTop": {},
                      "marginBottom": {},
                      "marginInlineStart": {},
                      "marginInlineEnd": {},
                      "gap": {
                        "defaultValue": "12px"
                      },
                      "justifyContent": {},
                      "alignItems": {
                        "defaultValue": "center"
                      },
                      "alignSelf": {}
                    },
                    "elements": {
                      "testimonialsGridAuthorName": {
                        "elementType": "inlineElement",
                        "inlineElement": {
                          "selector": ".testimonials-grid-author-name",
                          "displayName": "Author Name",
                          "behaviors": {
                            "removable": true,
                            "selectable": false
                          },
                          "cssProperties": {
                            "font": {
                              "defaultValue": "600 14px inherit,sans-serif"
                            },
                            "lineHeight": {},
                            "letterSpacing": {},
                            "textDecorationLine": {},
                            "textTransform": {},
                            "textAlign": {},
                            "textShadow": {},
                            "color": {
                              "defaultValue": "#0f172a"
                            },
                            "marginInlineStart": {},
                            "marginInlineEnd": {},
                            "display": {
                              "display": {
                                "displayValues": [
                                  "none",
                                  "inline"
                                ]
                              }
                            },
                            "alignSelf": {}
                          }
                        }
                      },
                      "testimonialsGridAuthorRole": {
                        "elementType": "inlineElement",
                        "inlineElement": {
                          "selector": ".testimonials-grid-author-role",
                          "displayName": "Author Role",
                          "behaviors": {
                            "removable": true,
                            "selectable": false
                          },
                          "cssProperties": {
                            "font": {
                              "defaultValue": "400 12px inherit,sans-serif"
                            },
                            "lineHeight": {},
                            "letterSpacing": {},
                            "textDecorationLine": {},
                            "textTransform": {},
                            "textAlign": {},
                            "textShadow": {},
                            "color": {
                              "defaultValue": "#64748b"
                            },
                            "marginInlineStart": {},
                            "marginInlineEnd": {},
                            "display": {
                              "display": {
                                "displayValues": [
                                  "none",
                                  "inline"
                                ]
                              }
                            },
                            "alignSelf": {}
                          }
                        }
                      },
                      "testimonialsGridBadge": {
                        "elementType": "inlineElement",
                        "inlineElement": {
                          "selector": ".testimonials-grid-badge",
                          "displayName": "Badge",
                          "behaviors": {
                            "removable": true,
                            "selectable": false
                          },
                          "cssProperties": {
                            "font": {
                              "defaultValue": "600 11px inherit,sans-serif"
                            },
                            "lineHeight": {},
                            "letterSpacing": {},
                            "textDecorationLine": {},
                            "textTransform": {},
                            "textAlign": {},
                            "textShadow": {},
                            "color": {
                              "defaultValue": "#15803d"
                            },
                            "marginInlineStart": {},
                            "marginInlineEnd": {},
                            "display": {
                              "display": {
                                "displayValues": [
                                  "none",
                                  "inline"
                                ]
                              }
                            },
                            "alignSelf": {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "cssProperties": {
    "background": {
      "defaultValue": "#ffffff"
    },
    "borderTop": {
      "defaultValue": "1px solid #e2e8f0"
    },
    "borderBottom": {
      "defaultValue": "1px solid #e2e8f0"
    },
    "borderInlineStart": {
      "defaultValue": "1px solid #e2e8f0"
    },
    "borderInlineEnd": {
      "defaultValue": "1px solid #e2e8f0"
    },
    "paddingTop": {
      "defaultValue": "32px"
    },
    "paddingBottom": {
      "defaultValue": "32px"
    },
    "paddingInlineStart": {
      "defaultValue": "32px"
    },
    "paddingInlineEnd": {
      "defaultValue": "32px"
    },
    "borderStartStartRadius": {
      "defaultValue": "12px"
    },
    "borderStartEndRadius": {
      "defaultValue": "12px"
    },
    "borderEndStartRadius": {
      "defaultValue": "12px"
    },
    "borderEndEndRadius": {
      "defaultValue": "12px"
    },
    "boxShadow": {
      "defaultValue": "0 1px 3px rgba(0,0,0,0.05)"
    },
    "overflow": {},
    "mixBlendMode": {
      "defaultValue": "normal"
    },
    "gap": {
      "defaultValue": "32px"
    },
    "justifyContent": {},
    "alignItems": {}
  },
  "cssCustomProperties": {}
} as EditorElement;
