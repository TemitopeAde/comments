/**
 * THIS FILE IS AUTO-GENERATED — DO NOT EDIT.
 * It contains the `editorElement` portion of the manifest, automatically derived from your component's
 * source code, prop types, and CSS rules.
 * Update your source code and run `npx wix build && npx wix generate manifest` to regenerate it.
 * If you need to override specific manifest values (sizing, layout, etc.),
 * you can do so in comments-thread.extension.ts.
 */

import type { EditorElement } from '@wix/react-component-schema';

export const editorElement = {
  "selector": ".comments-thread",
  "displayName": "Comments Thread",
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
    "ratingLabel": {
      "displayName": "Rating Label",
      "dataType": "text",
      "text": {}
    },
    "composerPlaceholder": {
      "displayName": "Composer Placeholder",
      "dataType": "text",
      "text": {}
    },
    "submitButtonLabel": {
      "displayName": "Submit Button Label",
      "dataType": "text",
      "text": {}
    },
    "emptyTitle": {
      "displayName": "Empty Title",
      "dataType": "text",
      "text": {}
    },
    "emptySubtitle": {
      "displayName": "Empty Subtitle",
      "dataType": "text",
      "text": {}
    },
    "loadMoreLabel": {
      "displayName": "Load More Label",
      "dataType": "text",
      "text": {}
    },
    "replyButtonLabel": {
      "displayName": "Reply Button Label",
      "dataType": "text",
      "text": {}
    },
    "likeButtonLabel": {
      "displayName": "Like Button Label",
      "dataType": "text",
      "text": {}
    },
    "comments": {
      "displayName": "Comments",
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
            "date": {
              "displayName": "Date",
              "dataType": "text",
              "text": {}
            },
            "content": {
              "displayName": "Content",
              "dataType": "text",
              "text": {}
            },
            "likesCount": {
              "displayName": "Likes Count",
              "dataType": "number",
              "number": {}
            },
            "repliesCount": {
              "displayName": "Replies Count",
              "dataType": "number",
              "number": {}
            },
            "badge": {
              "displayName": "Badge",
              "dataType": "text",
              "text": {}
            }
          }
        }
      }
    }
  },
  "elements": {
    "commentsThreadHeader": {
      "elementType": "inlineElement",
      "inlineElement": {
        "selector": ".comments-thread-header",
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
          "alignItems": {},
          "alignSelf": {}
        },
        "elements": {
          "commentsThreadTitle": {
            "elementType": "inlineElement",
            "inlineElement": {
              "selector": ".comments-thread-title",
              "displayName": "Title",
              "behaviors": {
                "removable": true,
                "selectable": false
              },
              "cssProperties": {
                "font": {
                  "defaultValue": "700 24px/1.3 inherit,sans-serif"
                },
                "lineHeight": {
                  "defaultValue": "1.3"
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
          "commentsThreadSubtitle": {
            "elementType": "inlineElement",
            "inlineElement": {
              "selector": ".comments-thread-subtitle",
              "displayName": "Subtitle",
              "behaviors": {
                "removable": true,
                "selectable": false
              },
              "cssProperties": {
                "font": {
                  "defaultValue": "400 15px/1.5 inherit,sans-serif"
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
          }
        }
      }
    },
    "commentsThreadComposer": {
      "elementType": "inlineElement",
      "inlineElement": {
        "selector": ".comments-thread-composer",
        "displayName": "Composer",
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
            "defaultValue": "16px"
          },
          "paddingBottom": {
            "defaultValue": "16px"
          },
          "paddingInlineStart": {
            "defaultValue": "16px"
          },
          "paddingInlineEnd": {
            "defaultValue": "16px"
          },
          "borderStartStartRadius": {
            "defaultValue": "8px"
          },
          "borderStartEndRadius": {
            "defaultValue": "8px"
          },
          "borderEndStartRadius": {
            "defaultValue": "8px"
          },
          "borderEndEndRadius": {
            "defaultValue": "8px"
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
            "defaultValue": "12px"
          },
          "justifyContent": {},
          "alignItems": {},
          "alignSelf": {}
        },
        "elements": {
          "commentsThreadTextarea": {
            "elementType": "inlineElement",
            "inlineElement": {
              "selector": ".comments-thread-textarea",
              "displayName": "Textarea",
              "behaviors": {
                "removable": true,
                "selectable": false
              },
              "cssProperties": {
                "font": {
                  "defaultValue": "14px/1.5 inherit,sans-serif"
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
                  "defaultValue": "#0f172a"
                },
                "background": {
                  "defaultValue": "#ffffff"
                },
                "borderTop": {
                  "defaultValue": "1px solid #cbd5e1"
                },
                "borderBottom": {
                  "defaultValue": "1px solid #cbd5e1"
                },
                "borderInlineStart": {
                  "defaultValue": "1px solid #cbd5e1"
                },
                "borderInlineEnd": {
                  "defaultValue": "1px solid #cbd5e1"
                },
                "paddingTop": {
                  "defaultValue": "12px"
                },
                "paddingBottom": {
                  "defaultValue": "12px"
                },
                "paddingInlineStart": {
                  "defaultValue": "12px"
                },
                "paddingInlineEnd": {
                  "defaultValue": "12px"
                },
                "borderStartStartRadius": {
                  "defaultValue": "6px"
                },
                "borderStartEndRadius": {
                  "defaultValue": "6px"
                },
                "borderEndStartRadius": {
                  "defaultValue": "6px"
                },
                "borderEndEndRadius": {
                  "defaultValue": "6px"
                },
                "boxShadow": {},
                "width": {
                  "defaultValue": "100%"
                },
                "height": {},
                "overflow": {},
                "mixBlendMode": {
                  "defaultValue": "normal"
                },
                "marginTop": {},
                "marginBottom": {},
                "marginInlineStart": {},
                "marginInlineEnd": {},
                "display": {
                  "display": {
                    "displayValues": [
                      "none",
                      "inlineBlock"
                    ]
                  }
                },
                "alignSelf": {}
              },
              "states": {
                "hover": {
                  "displayName": "Hover",
                  "className": "comments-thread-textarea--hover",
                  "pseudoClass": "hover"
                },
                "focus": {
                  "displayName": "Focus",
                  "className": "comments-thread-textarea--focus",
                  "pseudoClass": "focus"
                }
              }
            }
          },
          "commentsThreadSubmitButton": {
            "elementType": "inlineElement",
            "inlineElement": {
              "selector": ".comments-thread-submit-button",
              "displayName": "Submit Button",
              "behaviors": {
                "removable": true,
                "selectable": false
              },
              "data": {
                "a11y": {
                  "displayName": "Accessibility",
                  "dataType": "a11y",
                  "a11y": {
                    "attributes": [
                      "ariaLabel"
                    ]
                  }
                }
              },
              "cssProperties": {
                "background": {
                  "defaultValue": "#2563eb",
                  "statesDefaultValues": {
                    "hover": "#1d4ed8"
                  }
                },
                "borderTop": {
                  "defaultValue": "none"
                },
                "borderBottom": {
                  "defaultValue": "none"
                },
                "borderInlineStart": {
                  "defaultValue": "none"
                },
                "borderInlineEnd": {
                  "defaultValue": "none"
                },
                "paddingTop": {
                  "defaultValue": "10px"
                },
                "paddingBottom": {
                  "defaultValue": "10px"
                },
                "paddingInlineStart": {
                  "defaultValue": "20px"
                },
                "paddingInlineEnd": {
                  "defaultValue": "20px"
                },
                "borderStartStartRadius": {
                  "defaultValue": "6px"
                },
                "borderStartEndRadius": {
                  "defaultValue": "6px"
                },
                "borderEndStartRadius": {
                  "defaultValue": "6px"
                },
                "borderEndEndRadius": {
                  "defaultValue": "6px"
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
                      "inlineFlex"
                    ]
                  }
                },
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
                  "defaultValue": "#ffffff"
                },
                "marginTop": {},
                "marginBottom": {},
                "marginInlineStart": {},
                "marginInlineEnd": {},
                "justifyContent": {
                  "defaultValue": "center"
                },
                "alignItems": {
                  "defaultValue": "center"
                },
                "alignSelf": {}
              },
              "states": {
                "hover": {
                  "displayName": "Hover",
                  "className": "comments-thread-submit-button--hover",
                  "pseudoClass": "hover"
                }
              }
            }
          }
        }
      }
    },
    "commentsThreadList": {
      "elementType": "inlineElement",
      "inlineElement": {
        "selector": ".comments-thread-list",
        "displayName": "List",
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
            "defaultValue": "16px"
          },
          "justifyContent": {},
          "alignItems": {},
          "alignSelf": {}
        },
        "elements": {
          "commentsThreadItem": {
            "elementType": "inlineElement",
            "inlineElement": {
              "selector": ".comments-thread-item",
              "displayName": "Item",
              "behaviors": {
                "removable": true,
                "selectable": false
              },
              "cssProperties": {
                "background": {
                  "defaultValue": "#ffffff"
                },
                "borderTop": {
                  "defaultValue": "1px solid #f1f5f9"
                },
                "borderBottom": {
                  "defaultValue": "1px solid #f1f5f9"
                },
                "borderInlineStart": {
                  "defaultValue": "1px solid #f1f5f9"
                },
                "borderInlineEnd": {
                  "defaultValue": "1px solid #f1f5f9"
                },
                "paddingTop": {
                  "defaultValue": "16px"
                },
                "paddingBottom": {
                  "defaultValue": "16px"
                },
                "paddingInlineStart": {
                  "defaultValue": "16px"
                },
                "paddingInlineEnd": {
                  "defaultValue": "16px"
                },
                "borderStartStartRadius": {
                  "defaultValue": "8px"
                },
                "borderStartEndRadius": {
                  "defaultValue": "8px"
                },
                "borderEndStartRadius": {
                  "defaultValue": "8px"
                },
                "borderEndEndRadius": {
                  "defaultValue": "8px"
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
                  "defaultValue": "12px"
                },
                "justifyContent": {},
                "alignItems": {},
                "alignSelf": {}
              },
              "elements": {
                "commentsThreadAuthorName": {
                  "elementType": "inlineElement",
                  "inlineElement": {
                    "selector": ".comments-thread-author-name",
                    "displayName": "Author Name",
                    "behaviors": {
                      "removable": true,
                      "selectable": false
                    },
                    "cssProperties": {
                      "font": {
                        "defaultValue": "600 15px inherit,sans-serif"
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
                "commentsThreadBadge": {
                  "elementType": "inlineElement",
                  "inlineElement": {
                    "selector": ".comments-thread-badge",
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
                        "defaultValue": "#1d4ed8"
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
                "commentsThreadDate": {
                  "elementType": "inlineElement",
                  "inlineElement": {
                    "selector": ".comments-thread-date",
                    "displayName": "Date",
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
                      "marginTop": {},
                      "marginBottom": {},
                      "marginInlineStart": {},
                      "marginInlineEnd": {},
                      "display": {
                        "display": {
                          "displayValues": [
                            "none",
                            "block"
                          ]
                        }
                      },
                      "font": {
                        "defaultValue": "12px inherit,sans-serif"
                      },
                      "lineHeight": {},
                      "letterSpacing": {},
                      "textDecorationLine": {},
                      "textTransform": {},
                      "textAlign": {},
                      "textShadow": {},
                      "color": {
                        "defaultValue": "#94a3b8"
                      },
                      "alignSelf": {}
                    }
                  }
                },
                "commentsThreadRating": {
                  "elementType": "inlineElement",
                  "inlineElement": {
                    "selector": ".comments-thread-rating",
                    "displayName": "Rating",
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
                "commentsThreadContent": {
                  "elementType": "inlineElement",
                  "inlineElement": {
                    "selector": ".comments-thread-content",
                    "displayName": "Content",
                    "behaviors": {
                      "removable": true,
                      "selectable": false
                    },
                    "cssProperties": {
                      "font": {
                        "defaultValue": "14px/1.6 inherit,sans-serif"
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
                "commentsThreadActions": {
                  "elementType": "inlineElement",
                  "inlineElement": {
                    "selector": ".comments-thread-actions",
                    "displayName": "Actions",
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
                        "defaultValue": "4px"
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
                        "defaultValue": "16px"
                      },
                      "justifyContent": {},
                      "alignItems": {
                        "defaultValue": "center"
                      },
                      "alignSelf": {}
                    },
                    "elements": {
                      "commentsThreadLikeButton": {
                        "elementType": "inlineElement",
                        "inlineElement": {
                          "selector": ".comments-thread-like-button",
                          "displayName": "Like Button",
                          "behaviors": {
                            "removable": true,
                            "selectable": false
                          },
                          "data": {
                            "a11y": {
                              "displayName": "Accessibility",
                              "dataType": "a11y",
                              "a11y": {
                                "attributes": [
                                  "ariaLabel"
                                ]
                              }
                            }
                          },
                          "cssProperties": {
                            "background": {
                              "defaultValue": "transparent"
                            },
                            "borderTop": {
                              "defaultValue": "none"
                            },
                            "borderBottom": {
                              "defaultValue": "none"
                            },
                            "borderInlineStart": {
                              "defaultValue": "none"
                            },
                            "borderInlineEnd": {
                              "defaultValue": "none"
                            },
                            "paddingTop": {
                              "defaultValue": "8px"
                            },
                            "paddingBottom": {
                              "defaultValue": "8px"
                            },
                            "paddingInlineStart": {
                              "defaultValue": "8px"
                            },
                            "paddingInlineEnd": {
                              "defaultValue": "8px"
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
                                  "inlineFlex"
                                ]
                              }
                            },
                            "font": {
                              "defaultValue": "500 13px inherit,sans-serif"
                            },
                            "lineHeight": {},
                            "letterSpacing": {},
                            "textDecorationLine": {},
                            "textTransform": {},
                            "textAlign": {},
                            "textShadow": {},
                            "color": {
                              "defaultValue": "#64748b",
                              "statesDefaultValues": {
                                "hover": "#dc2626"
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
                          },
                          "states": {
                            "hover": {
                              "displayName": "Hover",
                              "className": "comments-thread-like-button--hover",
                              "pseudoClass": "hover"
                            }
                          }
                        }
                      },
                      "commentsThreadReplyButton": {
                        "elementType": "inlineElement",
                        "inlineElement": {
                          "selector": ".comments-thread-reply-button",
                          "displayName": "Reply Button",
                          "behaviors": {
                            "removable": true,
                            "selectable": false
                          },
                          "data": {
                            "a11y": {
                              "displayName": "Accessibility",
                              "dataType": "a11y",
                              "a11y": {
                                "attributes": [
                                  "ariaLabel"
                                ]
                              }
                            }
                          },
                          "cssProperties": {
                            "background": {
                              "defaultValue": "transparent"
                            },
                            "borderTop": {
                              "defaultValue": "none"
                            },
                            "borderBottom": {
                              "defaultValue": "none"
                            },
                            "borderInlineStart": {
                              "defaultValue": "none"
                            },
                            "borderInlineEnd": {
                              "defaultValue": "none"
                            },
                            "paddingTop": {
                              "defaultValue": "8px"
                            },
                            "paddingBottom": {
                              "defaultValue": "8px"
                            },
                            "paddingInlineStart": {
                              "defaultValue": "8px"
                            },
                            "paddingInlineEnd": {
                              "defaultValue": "8px"
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
                                  "inlineFlex"
                                ]
                              }
                            },
                            "font": {
                              "defaultValue": "500 13px inherit,sans-serif"
                            },
                            "lineHeight": {},
                            "letterSpacing": {},
                            "textDecorationLine": {},
                            "textTransform": {},
                            "textAlign": {},
                            "textShadow": {},
                            "color": {
                              "defaultValue": "#64748b",
                              "statesDefaultValues": {
                                "hover": "#2563eb"
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
                          },
                          "states": {
                            "hover": {
                              "displayName": "Hover",
                              "className": "comments-thread-reply-button--hover",
                              "pseudoClass": "hover"
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
    "commentsThreadEmptyState": {
      "elementType": "inlineElement",
      "inlineElement": {
        "selector": ".comments-thread-empty-state",
        "displayName": "Empty State",
        "behaviors": {
          "removable": true,
          "selectable": false
        },
        "cssProperties": {
          "background": {
            "defaultValue": "#f8fafc"
          },
          "borderTop": {
            "defaultValue": "1px dashed #cbd5e1"
          },
          "borderBottom": {
            "defaultValue": "1px dashed #cbd5e1"
          },
          "borderInlineStart": {
            "defaultValue": "1px dashed #cbd5e1"
          },
          "borderInlineEnd": {
            "defaultValue": "1px dashed #cbd5e1"
          },
          "paddingTop": {
            "defaultValue": "36px"
          },
          "paddingBottom": {
            "defaultValue": "36px"
          },
          "paddingInlineStart": {
            "defaultValue": "16px"
          },
          "paddingInlineEnd": {
            "defaultValue": "16px"
          },
          "borderStartStartRadius": {
            "defaultValue": "8px"
          },
          "borderStartEndRadius": {
            "defaultValue": "8px"
          },
          "borderEndStartRadius": {
            "defaultValue": "8px"
          },
          "borderEndEndRadius": {
            "defaultValue": "8px"
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
            "defaultValue": "8px"
          },
          "justifyContent": {
            "defaultValue": "center"
          },
          "alignItems": {
            "defaultValue": "center"
          },
          "alignSelf": {}
        },
        "elements": {
          "commentsThreadEmptyTitle": {
            "elementType": "inlineElement",
            "inlineElement": {
              "selector": ".comments-thread-empty-title",
              "displayName": "Empty Title",
              "behaviors": {
                "removable": true,
                "selectable": false
              },
              "cssProperties": {
                "font": {
                  "defaultValue": "600 16px inherit,sans-serif"
                },
                "lineHeight": {},
                "letterSpacing": {},
                "textDecorationLine": {},
                "textTransform": {},
                "textAlign": {},
                "textShadow": {},
                "color": {
                  "defaultValue": "#1e293b"
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
          "commentsThreadEmptySubtitle": {
            "elementType": "inlineElement",
            "inlineElement": {
              "selector": ".comments-thread-empty-subtitle",
              "displayName": "Empty Subtitle",
              "behaviors": {
                "removable": true,
                "selectable": false
              },
              "cssProperties": {
                "font": {
                  "defaultValue": "400 14px inherit,sans-serif"
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
          }
        }
      }
    },
    "commentsThreadLoadMoreButton": {
      "elementType": "inlineElement",
      "inlineElement": {
        "selector": ".comments-thread-load-more-button",
        "displayName": "Load More Button",
        "behaviors": {
          "removable": true,
          "selectable": false
        },
        "data": {
          "a11y": {
            "displayName": "Accessibility",
            "dataType": "a11y",
            "a11y": {
              "attributes": [
                "ariaLabel"
              ]
            }
          }
        },
        "cssProperties": {
          "background": {
            "defaultValue": "#ffffff",
            "statesDefaultValues": {
              "hover": "#f1f5f9"
            }
          },
          "borderTop": {
            "defaultValue": "1px solid #cbd5e1"
          },
          "borderBottom": {
            "defaultValue": "1px solid #cbd5e1"
          },
          "borderInlineStart": {
            "defaultValue": "1px solid #cbd5e1"
          },
          "borderInlineEnd": {
            "defaultValue": "1px solid #cbd5e1"
          },
          "paddingTop": {
            "defaultValue": "10px"
          },
          "paddingBottom": {
            "defaultValue": "10px"
          },
          "paddingInlineStart": {
            "defaultValue": "24px"
          },
          "paddingInlineEnd": {
            "defaultValue": "24px"
          },
          "borderStartStartRadius": {
            "defaultValue": "6px"
          },
          "borderStartEndRadius": {
            "defaultValue": "6px"
          },
          "borderEndStartRadius": {
            "defaultValue": "6px"
          },
          "borderEndEndRadius": {
            "defaultValue": "6px"
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
                "inlineFlex"
              ]
            }
          },
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
            "defaultValue": "#475569",
            "statesDefaultValues": {
              "hover": "#0f172a"
            }
          },
          "marginTop": {},
          "marginBottom": {},
          "marginInlineStart": {},
          "marginInlineEnd": {},
          "justifyContent": {
            "defaultValue": "center"
          },
          "alignItems": {
            "defaultValue": "center"
          },
          "alignSelf": {}
        },
        "states": {
          "hover": {
            "displayName": "Hover",
            "className": "comments-thread-load-more-button--hover",
            "pseudoClass": "hover"
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
      "defaultValue": "24px"
    },
    "paddingBottom": {
      "defaultValue": "24px"
    },
    "paddingInlineStart": {
      "defaultValue": "24px"
    },
    "paddingInlineEnd": {
      "defaultValue": "24px"
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
      "defaultValue": "24px"
    },
    "justifyContent": {},
    "alignItems": {}
  },
  "cssCustomProperties": {}
} as EditorElement;
