import React, { type FC, useState, useEffect, useCallback } from 'react';
import { inputs, widget } from '@wix/editor';
import { httpClient } from '@wix/essentials';
import {
  SidePanel,
  WixDesignSystemProvider,
  Button,
  FillPreview,
  Input,
  FormField,
  ToggleSwitch,
  Accordion,
  Box,
  Text,
  SectionHelper,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';

interface FontPickerValue {
  font: string;
  textDecoration?: string;
}

const DEFAULT_FONT = '16px helvetica-w01-roman';
const API_ORIGIN = new URL(import.meta.url).origin;
const apiUrl = (path: string) => new URL(path, API_ORIGIN).toString();

interface TrialStatus {
  available: boolean;
  upgradeUrl?: string;
}

type EditorToolbarOptions = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  orderedList: boolean;
  bulletList: boolean;
  link: boolean;
  image: boolean;
  clean: boolean;
};

const DEFAULT_EDITOR_TOOLBAR: EditorToolbarOptions = {
  bold: true,
  italic: true,
  underline: true,
  orderedList: true,
  bulletList: true,
  link: true,
  image: true,
  clean: true,
};

const ColorSwatch: FC<{ color: string; onClick: () => void }> = ({ color, onClick }) => (
  <FillPreview fill={color} size="small" onClick={onClick} />
);

const Panel: FC = () => {
  const [title, setTitle] = useState<string>('Comments & Feedback');
  const [subtitle, setSubtitle] = useState<string>('Join the conversation and share your verified thoughts');
  const [editorPlaceholder, setEditorPlaceholder] = useState<string>('Share your comments, questions, or reviews...');
  const [primaryColor, setPrimaryColor] = useState<string>('#3899ec');
  const [starColor, setStarColor] = useState<string>('#ffb800');
  const [titleColor, setTitleColor] = useState<string>('#0f172a');
  const [subtitleColor, setSubtitleColor] = useState<string>('#64748b');
  const [bodyColor, setBodyColor] = useState<string>('#334155');
  const [buttonTextColor, setButtonTextColor] = useState<string>('#ffffff');
  const [enableRatings, setEnableRatings] = useState<boolean>(false);
  const [enableReplies, setEnableReplies] = useState<boolean>(true);
  const [enableReactions, setEnableReactions] = useState<boolean>(true);
  const [allowGuest, setAllowGuest] = useState<boolean>(true);
  const [requireApproval, setRequireApproval] = useState<boolean>(false);
  const [font, setFont] = useState<FontPickerValue>({ font: DEFAULT_FONT, textDecoration: '' });
  const [titleFont, setTitleFont] = useState<FontPickerValue>({ font: DEFAULT_FONT, textDecoration: '' });
  const [subtitleFont, setSubtitleFont] = useState<FontPickerValue>({ font: DEFAULT_FONT, textDecoration: '' });
  const [bodyFont, setBodyFont] = useState<FontPickerValue>({ font: DEFAULT_FONT, textDecoration: '' });
  const [buttonFont, setButtonFont] = useState<FontPickerValue>({ font: DEFAULT_FONT, textDecoration: '' });
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({ available: false });
  const [editorToolbar, setEditorToolbar] = useState<EditorToolbarOptions>(DEFAULT_EDITOR_TOOLBAR);
  const [blockedWords, setBlockedWords] = useState<string[]>([]);
  const [blockedWordInput, setBlockedWordInput] = useState<string>('');

  useEffect(() => {
    httpClient.fetchWithAuth(apiUrl('/api/dashboard/trial-status'))
      .then(async (response) => {
        if (response.ok) setTrialStatus(await response.json());
      })
      .catch(console.error);

    widget.getProp('title').then((v) => v && setTitle(v)).catch(console.error);
    widget.getProp('subtitle').then((v) => v && setSubtitle(v)).catch(console.error);
    widget.getProp('editor-placeholder').then((v) => v && setEditorPlaceholder(v)).catch(console.error);
    widget.getProp('primary-color').then((v) => v && setPrimaryColor(v)).catch(console.error);
    widget.getProp('star-color').then((v) => v && setStarColor(v)).catch(console.error);
    widget.getProp('title-color').then((v) => v && setTitleColor(v)).catch(console.error);
    widget.getProp('subtitle-color').then((v) => v && setSubtitleColor(v)).catch(console.error);
    widget.getProp('body-color').then((v) => v && setBodyColor(v)).catch(console.error);
    widget.getProp('button-text-color').then((v) => v && setButtonTextColor(v)).catch(console.error);
    widget.getProp('enable-ratings').then((v) => setEnableRatings(v === 'true')).catch(console.error);
    widget.getProp('enable-replies').then((v) => setEnableReplies(v !== 'false')).catch(console.error);
    widget.getProp('enable-reactions').then((v) => setEnableReactions(v !== 'false')).catch(console.error);
    widget.getProp('allow-guest').then((v) => setAllowGuest(v !== 'false')).catch(console.error);
    widget.getProp('require-approval').then((v) => setRequireApproval(v === 'true')).catch(console.error);
    widget.getProp('editor-toolbar').then((v) => {
      if (!v) return;
      try {
        setEditorToolbar({ ...DEFAULT_EDITOR_TOOLBAR, ...JSON.parse(v) });
      } catch (error) {
        console.error('Failed to read editor toolbar settings:', error);
      }
    }).catch(console.error);
    httpClient.fetchWithAuth(apiUrl('/api/dashboard/widgets'))
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        const settings = data.items?.find((item: { widgetKey?: string }) => item.widgetKey === 'engage-comments')?.settings;
        if (Array.isArray(settings?.blockedWords)) setBlockedWords(settings.blockedWords);
      })
      .catch(console.error);
    widget.getProp('font').then((v) => {
      if (!v) return;
      try {
        const value = JSON.parse(v) as FontPickerValue;
        if (value.font) setFont({ font: value.font, textDecoration: value.textDecoration || '' });
      } catch (error) {
        console.error('Failed to read widget font:', error);
      }
    }).catch(console.error);
    const loadFont = (propName: string, setValue: (value: FontPickerValue) => void) => {
      widget.getProp(propName).then((v) => {
        if (!v) return;
        try {
          const value = JSON.parse(v) as FontPickerValue;
          if (value.font) setValue({ font: value.font, textDecoration: value.textDecoration || '' });
        } catch (error) {
          console.error(`Failed to read widget font (${propName}):`, error);
        }
      }).catch(console.error);
    };
    loadFont('title-font', setTitleFont);
    loadFont('subtitle-font', setSubtitleFont);
    loadFont('body-font', setBodyFont);
    loadFont('button-font', setButtonFont);
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    widget.setProp('title', val);
  }, []);

  const handleSubtitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSubtitle(val);
    widget.setProp('subtitle', val);
  }, []);

  const handleEditorPlaceholderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditorPlaceholder(val);
    widget.setProp('editor-placeholder', val);
  }, []);

  const handleColorPick = useCallback((propName: string, value: string, onChange: (next: string) => void) => {
    inputs.selectColor(value, {
      onChange: (next) => {
        if (!next) return;
        onChange(next);
        widget.setProp(propName, next);
      },
    });
  }, []);

  const handleFontPick = useCallback(() => {
    inputs.selectFont(font, {
      onChange: (next) => {
        if (!next) return;
        const value = { font: next.font, textDecoration: next.textDecoration || '' };
        setFont(value);
        widget.setProp('font', JSON.stringify(value));
      },
    });
  }, [font]);

  const handleElementFontPick = useCallback((propName: string, value: FontPickerValue, onChange: (next: FontPickerValue) => void) => {
    inputs.selectFont(value, {
      onChange: (next) => {
        if (!next) return;
        const nextValue = { font: next.font, textDecoration: next.textDecoration || '' };
        onChange(nextValue);
        widget.setProp(propName, JSON.stringify(nextValue));
      },
    });
  }, []);

  const handleToggleRatings = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    setEnableRatings(val);
    widget.setProp('enable-ratings', val ? 'true' : 'false');
  }, []);

  const handleToggleReplies = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    setEnableReplies(val);
    widget.setProp('enable-replies', val ? 'true' : 'false');
  }, []);

  const handleToggleReactions = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    setEnableReactions(val);
    widget.setProp('enable-reactions', val ? 'true' : 'false');
  }, []);

  const handleToggleGuestPosting = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    setAllowGuest(val);
    widget.setProp('allow-guest', val ? 'true' : 'false');
  }, []);

  const handleToggleApproval = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    setRequireApproval(val);
    widget.setProp('require-approval', val ? 'true' : 'false');
  }, []);

  const handleToolbarToggle = useCallback((key: keyof EditorToolbarOptions) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...editorToolbar, [key]: e.target.checked };
    setEditorToolbar(next);
    widget.setProp('editor-toolbar', JSON.stringify(next));
  }, [editorToolbar]);

  const saveBlockedWords = useCallback(async (nextWords: string[]) => {
    const response = await httpClient.fetchWithAuth(apiUrl('/api/dashboard/widgets'), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ widgetKey: 'engage-comments', settings: { blockedWords: nextWords } }),
    });
    if (!response.ok) throw new Error('Unable to save blocked words.');
  }, []);

  const handleAddBlockedWord = useCallback(async () => {
    const word = blockedWordInput.trim();
    if (!word || blockedWords.some((existing) => existing.toLowerCase() === word.toLowerCase())) return;

    const nextWords = [...blockedWords, word];
    setBlockedWords(nextWords);
    setBlockedWordInput('');
    try {
      await saveBlockedWords(nextWords);
    } catch (error) {
      setBlockedWords(blockedWords);
      console.error(error);
    }
  }, [blockedWordInput, blockedWords, saveBlockedWords]);

  const handleRemoveBlockedWord = useCallback(async (wordToRemove: string) => {
    const nextWords = blockedWords.filter((word) => word !== wordToRemove);
    setBlockedWords(nextWords);
    try {
      await saveBlockedWords(nextWords);
    } catch (error) {
      setBlockedWords(blockedWords);
      console.error(error);
    }
  }, [blockedWords, saveBlockedWords]);

  return (
    <WixDesignSystemProvider>
      <SidePanel width="320" height="100vh">
        <SidePanel.Header
          title=""
        />
        <SidePanel.Content noPadding stretchVertically>
          <Box width="100%" padding="16px">
            <Accordion
              size="small"
              skin="light"
              hideShadow
              multiple
              contentPadding="none"
              horizontalPadding="none"
              items={[
                {
                  title: 'Content',
                  children: (
                    <Box direction="vertical" gap="16px" padding="16px 0">
                      <SidePanel.Field>
                        <FormField label="Widget Title">
                          <Input value={title} onChange={handleTitleChange} />
                        </FormField>
                      </SidePanel.Field>
                      <SidePanel.Field>
                        <FormField label="Subtitle">
                          <Input value={subtitle} onChange={handleSubtitleChange} />
                        </FormField>
                      </SidePanel.Field>
                      <SidePanel.Field>
                        <FormField label="Comment editor placeholder">
                          <Input
                            value={editorPlaceholder}
                            onChange={handleEditorPlaceholderChange}
                            placeholder="Share your comments, questions, or reviews..."
                          />
                        </FormField>
                      </SidePanel.Field>
                    </Box>
                  ),
                },
                {
                  title: 'Typography & Colors',
                  children: (
                    <Box direction="vertical" gap="16px" padding="16px 0">
                      <SidePanel.Field>
                        <FormField label="Title">
                          <Box direction="vertical" gap="8px">
                            <Button priority="secondary" onClick={() => handleElementFontPick('title-font', titleFont, setTitleFont)} style={{ fontFamily: titleFont.font }}>
                              {titleFont.font}
                            </Button>
                            <Box gap="8px" verticalAlign="middle">
                              <ColorSwatch color={titleColor} onClick={() => handleColorPick('title-color', titleColor, setTitleColor)} />
                              <Text size="small">{titleColor}</Text>
                            </Box>
                          </Box>
                        </FormField>
                      </SidePanel.Field>

                      <SidePanel.Field>
                        <FormField label="Subtitle">
                          <Box direction="vertical" gap="8px">
                            <Button priority="secondary" onClick={() => handleElementFontPick('subtitle-font', subtitleFont, setSubtitleFont)} style={{ fontFamily: subtitleFont.font }}>
                              {subtitleFont.font}
                            </Button>
                            <Box gap="8px" verticalAlign="middle">
                              <ColorSwatch color={subtitleColor} onClick={() => handleColorPick('subtitle-color', subtitleColor, setSubtitleColor)} />
                              <Text size="small">{subtitleColor}</Text>
                            </Box>
                          </Box>
                        </FormField>
                      </SidePanel.Field>

                      <SidePanel.Field>
                        <FormField label="Body Text">
                          <Box direction="vertical" gap="8px">
                            <Button priority="secondary" onClick={() => handleElementFontPick('body-font', bodyFont, setBodyFont)} style={{ fontFamily: bodyFont.font }}>
                              {bodyFont.font}
                            </Button>
                            <Box gap="8px" verticalAlign="middle">
                              <ColorSwatch color={bodyColor} onClick={() => handleColorPick('body-color', bodyColor, setBodyColor)} />
                              <Text size="small">{bodyColor}</Text>
                            </Box>
                          </Box>
                        </FormField>
                      </SidePanel.Field>

                      <SidePanel.Field>
                        <FormField label="Button Text">
                          <Box direction="vertical" gap="8px">
                            <Button priority="secondary" onClick={() => handleElementFontPick('button-font', buttonFont, setButtonFont)} style={{ fontFamily: buttonFont.font }}>
                              {buttonFont.font}
                            </Button>
                            <Box gap="8px" verticalAlign="middle">
                              <ColorSwatch color={buttonTextColor} onClick={() => handleColorPick('button-text-color', buttonTextColor, setButtonTextColor)} />
                              <Text size="small">{buttonTextColor}</Text>
                            </Box>
                          </Box>
                        </FormField>
                      </SidePanel.Field>

                      <SidePanel.Field>
                        <FormField label="Primary Accent Color">
                          <Box gap="8px" verticalAlign="middle">
                            <ColorSwatch color={primaryColor} onClick={() => handleColorPick('primary-color', primaryColor, setPrimaryColor)} />
                            <Text size="small">{primaryColor}</Text>
                          </Box>
                        </FormField>
                      </SidePanel.Field>

                      <SidePanel.Field>
                        <FormField label="Star Color">
                          <Box gap="8px" verticalAlign="middle">
                            <ColorSwatch color={starColor} onClick={() => handleColorPick('star-color', starColor, setStarColor)} />
                            <Text size="small">{starColor}</Text>
                          </Box>
                        </FormField>
                      </SidePanel.Field>

                      <SidePanel.Field>
                        <FormField label="Widget Font">
                          <Button priority="secondary" onClick={handleFontPick} style={{ fontFamily: font.font }}>
                            {font.font || 'Choose a font'}
                          </Button>
                        </FormField>
                      </SidePanel.Field>
                    </Box>
                  ),
                },
                {
                  title: 'Editor Toolbar',
                  children: (
                    <Box direction="vertical" gap="16px" padding="16px 0">
                      <Text size="tiny" secondary>Choose the formatting tools available when writing or editing comments and replies.</Text>
                      {([
                        ['bold', 'Bold'],
                        ['italic', 'Italic'],
                        ['underline', 'Underline'],
                        ['orderedList', 'Numbered list'],
                        ['bulletList', 'Bulleted list'],
                        ['link', 'Links'],
                        ['image', 'Images'],
                        ['clean', 'Clear formatting'],
                      ] as Array<[keyof EditorToolbarOptions, string]>).map(([key, label]) => (
                        <Box key={key} align="space-between" verticalAlign="middle">
                          <Text size="small">{label}</Text>
                          <ToggleSwitch checked={editorToolbar[key]} onChange={handleToolbarToggle(key)} />
                        </Box>
                      ))}
                    </Box>
                  ),
                },
                {
                  title: 'Behavior',
                  children: (
                    <Box direction="vertical" gap="20px" padding="16px 0">
                      <Box align="space-between" verticalAlign="middle">
                        <Box direction="vertical">
                          <Text size="small" weight="bold">Star Ratings</Text>
                          <Text size="tiny" secondary>Collect 1-5 star reviews</Text>
                        </Box>
                        <ToggleSwitch checked={enableRatings} onChange={handleToggleRatings} />
                      </Box>

                      <Box align="space-between" verticalAlign="middle">
                        <Box direction="vertical">
                          <Text size="small" weight="bold">Threaded Replies</Text>
                          <Text size="tiny" secondary>Allow discussions & answers</Text>
                        </Box>
                        <ToggleSwitch checked={enableReplies} onChange={handleToggleReplies} />
                      </Box>

                      <Box align="space-between" verticalAlign="middle">
                        <Box direction="vertical">
                          <Text size="small" weight="bold">Reactions (Like)</Text>
                          <Text size="tiny" secondary>Visitors can like comments</Text>
                        </Box>
                        <ToggleSwitch checked={enableReactions} onChange={handleToggleReactions} />
                      </Box>

                      <Box align="space-between" verticalAlign="middle">
                        <Box direction="vertical">
                          <Text size="small" weight="bold">Guest Commenting</Text>
                          <Text size="tiny" secondary>Allow visitors to post without signing in</Text>
                        </Box>
                        <ToggleSwitch checked={allowGuest} onChange={handleToggleGuestPosting} />
                      </Box>

                      <Box align="space-between" verticalAlign="middle">
                        <Box direction="vertical">
                          <Text size="small" weight="bold">Require Approval</Text>
                          <Text size="tiny" secondary>Review comments before publishing</Text>
                        </Box>
                        <ToggleSwitch checked={requireApproval} onChange={handleToggleApproval} />
                      </Box>

                      <SidePanel.Field>
                        <FormField label="Blocked words or phrases">
                          <Box direction="vertical" gap="8px">
                            <Text size="tiny" secondary>Submissions containing a match will be blocked.</Text>
                            <Box gap="8px" verticalAlign="middle">
                              <Input
                                value={blockedWordInput}
                                onChange={(event) => setBlockedWordInput(event.target.value)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                    event.preventDefault();
                                    void handleAddBlockedWord();
                                  }
                                }}
                                placeholder="Add a word or phrase"
                              />
                              <Button priority="secondary" onClick={() => void handleAddBlockedWord()}>
                                Add
                              </Button>
                            </Box>
                            {blockedWords.map((word) => (
                              <Box key={word} align="space-between" verticalAlign="middle">
                                <Text size="small">{word}</Text>
                                <Button priority="tertiary" onClick={() => void handleRemoveBlockedWord(word)}>
                                  Remove
                                </Button>
                              </Box>
                            ))}
                          </Box>
                        </FormField>
                      </SidePanel.Field>

                    </Box>
                  ),
                },
              ]}
            />
          </Box>
        </SidePanel.Content>
        <SidePanel.Footer noPadding>
          {trialStatus.available && trialStatus.upgradeUrl ? (
            <SectionHelper fullWidth appearance="standard" title="Try Pro free" border="topBottom">
              Start your free trial to unlock advanced widget features.
              <Box marginTop="8px">
                <Button
                  priority="primary"
                  onClick={() => window.open(trialStatus.upgradeUrl, '_blank', 'noopener,noreferrer')}
                >
                  Start free trial
                </Button>
              </Box>
            </SectionHelper>
          ) : (
            <SectionHelper fullWidth appearance="success" border="topBottom">
              Changes apply in real-time to your site preview and published pages.
            </SectionHelper>
          )}
        </SidePanel.Footer>
      </SidePanel>
    </WixDesignSystemProvider>
  );
};

export default Panel;
