import styles from '../../../assets/index.css';
import { Bot, BotProps } from '@/components/Bot';
import { BubbleParams } from '@/features/bubble/types';
import { createMemo, createSignal, onCleanup, onMount, Show } from 'solid-js';

const defaultButtonColor = '#transparent';
const defaultIconColor = 'black';

export type FullProps = BotProps & BubbleParams;

export const Full = (props: FullProps, { element }: { element: HTMLElement }) => {
  const [isBotDisplayed, setIsBotDisplayed] = createSignal(false);

  const regex = createMemo(() => /linear-gradient\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);

  const launchBot = () => {
    setIsBotDisplayed(true);
    document.body.style.margin = '0'; // Ensure no margin
    document.documentElement.style.padding = '0'; // Ensure no padding

    // Set viewport meta tag dynamically
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, interactive-widget=resizes-content');
    }
  };

  const botLauncherObserver = new IntersectionObserver((intersections) => {
    if (intersections.some((intersection) => intersection.isIntersecting)) launchBot();
  });

  onMount(() => {
    botLauncherObserver.observe(element);
  });

  onCleanup(() => {
    botLauncherObserver.disconnect();
    document.body.style.margin = ''; // Reset margin
    document.documentElement.style.padding = ''; // Reset padding

    // Reset viewport meta tag if needed
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
  });
  console.log(props, 'props');
  return (
    <>
      <style>{styles}</style>
      <Show when={isBotDisplayed()}>
        <div
          style={{
            'background-color': props.theme?.chatWindow?.backgroundColor || 'transparent',
            'background-image': props.theme?.chatWindow?.backgroundColor
              ? 'none'
              : props.theme?.chatWindow?.backgroundImage
                ? props.theme?.chatWindow?.backgroundImage.match(regex())
                  ? props.theme?.chatWindow?.backgroundImage
                  : `url(${props.theme?.chatWindow?.backgroundImage})`
                : 'url(https://cdn.jsdelivr.net/gh/Ark6Rj/ChatEmbed/src/assets/bgc1.svg), url(https://cdn.jsdelivr.net/gh/Ark6Rj/ChatEmbed/src/assets/bgc2.png), linear-gradient(173deg, #f4f9ff -24.94%, #edf1f9 103.15%)',
            'background-size': '100%',
            'background-position': '100% 0',
            'background-attachment': 'fixed',
            'background-repeat': 'no-repeat',
            height: props.theme?.chatWindow?.height ? `${props.theme?.chatWindow?.height.toString()}px` : '100dvh',
            width: props.theme?.chatWindow?.width ? `${props.theme?.chatWindow?.width.toString()}px` : '100%',
            margin: '0px',
            overflow: 'hidden', // Ensure no extra scrolling due to content overflow
          }}
        >
          <Bot
            badgeBackgroundColor={props.theme?.chatWindow?.backgroundColor || 'transparent'}
            bubbleBackgroundColor={props.theme?.button?.backgroundColor ?? defaultButtonColor}
            bubbleTextColor={props.theme?.button?.iconColor ?? defaultIconColor}
            showTitle={props.theme?.chatWindow?.showTitle}
            showAgentMessages={props.theme?.chatWindow?.showAgentMessages}
            title={props.theme?.chatWindow?.title}
            titleAvatarSrc={props.theme?.chatWindow?.titleAvatarSrc}
            welcomeMessage={props.theme?.chatWindow?.welcomeMessage}
            errorMessage={props.theme?.chatWindow?.errorMessage}
            poweredByTextColor={props.theme?.chatWindow?.poweredByTextColor}
            textInput={props.theme?.chatWindow?.textInput}
            botMessage={props.theme?.chatWindow?.botMessage}
            userMessage={props.theme?.chatWindow?.userMessage}
            feedback={props.theme?.chatWindow?.feedback}
            fontSize={props.theme?.chatWindow?.fontSize}
            footer={props.theme?.chatWindow?.footer}
            starterPrompts={props.theme?.chatWindow?.starterPrompts}
            chatflowid={props.chatflowid}
            chatflowConfig={props.chatflowConfig}
            apiHost={props.apiHost}
            isFullPage={true}
            observersConfig={props.observersConfig}
            starterPromptFontSize={props.theme?.chatWindow?.starterPromptFontSize}
          />
        </div>
      </Show>
    </>
  );
};
