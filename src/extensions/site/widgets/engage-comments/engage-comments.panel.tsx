import React, { type FC, useState, useEffect, useCallback } from 'react';
import { inputs, widget } from '@wix/editor';
import {
  SidePanel,
  WixDesignSystemProvider,
  Button,
  FillPreview,
  Input,
  FormField,
  ToggleSwitch,
  Divider,
  Box,
  Text,
  SectionHelper,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';

interface FontPickerValue {
  font: string;
  textDecoration?: string;
}

const Panel: FC = () => {
  const [title, setTitle] = useState<string>('Community Feedback & Reviews');
  const [subtitle, setSubtitle] = useState<string>('Join the conversation and share your verified thoughts');
  const [primaryColor, setPrimaryColor] = useState<string>('#3899ec');
  const [starColor, setStarColor] = useState<string>('#ffb800');
  const [enableRatings, setEnableRatings] = useState<boolean>(true);
  const [enableReplies, setEnableReplies] = useState<boolean>(true);
  const [enableReactions, setEnableReactions] = useState<boolean>(true);
  const [allowGuest, setAllowGuest] = useState<boolean>(true);
  const [requireApproval, setRequireApproval] = useState<boolean>(false);
  const [maxChars, setMaxChars] = useState<string>('1000');
  const [font, setFont] = useState<FontPickerValue>({ font: 'Arial', textDecoration: '' });

  useEffect(() => {
    widget.getProp('title').then((v) => v && setTitle(v)).catch(console.error);
    widget.getProp('subtitle').then((v) => v && setSubtitle(v)).catch(console.error);
    widget.getProp('primary-color').then((v) => v && setPrimaryColor(v)).catch(console.error);
    widget.getProp('star-color').then((v) => v && setStarColor(v)).catch(console.error);
    widget.getProp('enable-ratings').then((v) => setEnableRatings(v !== 'false')).catch(console.error);
    widget.getProp('enable-replies').then((v) => setEnableReplies(v !== 'false')).catch(console.error);
    widget.getProp('enable-reactions').then((v) => setEnableReactions(v !== 'false')).catch(console.error);
    widget.getProp('allow-guest').then((v) => setAllowGuest(v !== 'false')).catch(console.error);
    widget.getProp('require-approval').then((v) => setRequireApproval(v === 'true')).catch(console.error);
    widget.getProp('max-chars').then((v) => v && setMaxChars(v)).catch(console.error);
    widget.getProp('font').then((v) => {
      if (!v) return;
      try {
        const value = JSON.parse(v) as FontPickerValue;
        if (value.font) setFont({ font: value.font, textDecoration: value.textDecoration || '' });
      } catch (error) {
        console.error('Failed to read widget font:', error);
      }
    }).catch(console.error);
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

  const handleMaxCharsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMaxChars(val);
    widget.setProp('max-chars', val);
  }, []);

  return (
    <WixDesignSystemProvider>
      <SidePanel width="320" height="100vh">
        <SidePanel.Header
          title="Engage Comments Settings"
        />
        <SidePanel.Content noPadding stretchVertically>
          <Box direction="vertical" gap="16px" padding="16px">
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

            <Divider />

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

            <Divider />

            <SidePanel.Field>
              <FormField label="Primary Accent Color">
                <Box gap="8px" verticalAlign="middle">
                  <FillPreview
                    fill={primaryColor}
                    size="medium"
                    onClick={() => handleColorPick('primary-color', primaryColor, setPrimaryColor)}
                  />
                  <Text size="small">{primaryColor}</Text>
                </Box>
              </FormField>
            </SidePanel.Field>

            <SidePanel.Field>
              <FormField label="Star Color">
                <Box gap="8px" verticalAlign="middle">
                  <FillPreview
                    fill={starColor}
                    size="medium"
                    onClick={() => handleColorPick('star-color', starColor, setStarColor)}
                  />
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

            <SidePanel.Field>
              <FormField label="Max Characters">
                <Input type="number" value={maxChars} onChange={handleMaxCharsChange} />
              </FormField>
            </SidePanel.Field>
          </Box>
        </SidePanel.Content>
        <SidePanel.Footer noPadding>
          <SectionHelper fullWidth appearance="success" border="topBottom">
            Changes apply in real-time to your site preview and published pages.
          </SectionHelper>
        </SidePanel.Footer>
      </SidePanel>
    </WixDesignSystemProvider>
  );
};

export default Panel;
